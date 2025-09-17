# index.py
import os
import time
import platform
from datetime import datetime
from zoneinfo import ZoneInfo

from flask import Flask, render_template_string, request
from bs4 import BeautifulSoup
import pandas as pd

# Selenium (shared)
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

IS_WINDOWS = platform.system() == "Windows"
IS_LINUX = platform.system() == "Linux"

# --- Optional env for MIDAS login; falls back to given values ---
MIDAS_ID = os.environ.get("MIDAS_ID", "it@ywlgroup.com")
MIDAS_PWD = os.environ.get("MIDAS_PWD", "UY59zw33dth")

# --- Timezones ---
SGT = ZoneInfo("Asia/Singapore")
UTC = ZoneInfo("UTC")

# --- Flask app ---
app = Flask(__name__)

# -------------------------
# DB LAYER (platform-aware)
# -------------------------
if IS_WINDOWS:
    # PostgreSQL
    from dotenv import load_dotenv
    load_dotenv()

    import psycopg2
    from psycopg2.extras import RealDictCursor

    DATABASE_URL = os.environ.get("DATABASE_URL")
    if not DATABASE_URL:
        raise RuntimeError("DATABASE_URL env var missing (required on Windows)")

    def get_conn():
        return psycopg2.connect(DATABASE_URL)

    def init_db():
        with get_conn() as conn, conn.cursor() as cur:
            cur.execute("""
                CREATE TABLE IF NOT EXISTS usage (
                    id SERIAL PRIMARY KEY,
                    product_type TEXT NOT NULL,
                    user_name TEXT NOT NULL,
                    connected_time TIMESTAMPTZ NOT NULL,
                    scraped_at TIMESTAMPTZ NOT NULL,
                    UNIQUE(product_type, user_name, connected_time)
                )
            """)
            cur.execute("""
                CREATE TABLE IF NOT EXISTS name_map (
                    extracted_name TEXT PRIMARY KEY,
                    real_name TEXT NOT NULL
                )
            """)
            conn.commit()

    def db_fetch_name_map():
        with get_conn() as conn, conn.cursor() as cur:
            cur.execute("SELECT extracted_name, real_name FROM name_map")
            return dict(cur.fetchall()) if cur.rowcount != -1 else {}

    def db_upsert_usage(rows):
        # rows: list of tuples (product_type, user_name, connected_time(dt aware), scraped_at(dt aware))
        with get_conn() as conn, conn.cursor() as cur:
            for row in rows:
                cur.execute("""
                    INSERT INTO usage (product_type, user_name, connected_time, scraped_at)
                    VALUES (%s, %s, %s, %s)
                    ON CONFLICT (product_type, user_name, connected_time) DO NOTHING
                """, row)
            conn.commit()

    def db_query_filtered(user_query, license_query, start_date, end_date, name_map):
        filtered = []
        with get_conn() as conn, conn.cursor() as cur:
            clauses, params = [], []
            base = "SELECT product_type, user_name, connected_time FROM usage WHERE 1=1"
            if user_query:
                clauses.append(" AND user_name ILIKE %s")
                params.append(f"%{user_query}%")
            if license_query:
                clauses.append(" AND product_type = %s")
                params.append(license_query)
            if start_date:
                clauses.append(" AND connected_time >= %s::date")
                params.append(start_date)
            if end_date:
                clauses.append(" AND connected_time < (%s::date + INTERVAL '1 day')")
                params.append(end_date)
            sql = base + "".join(clauses) + " ORDER BY connected_time DESC LIMIT 1000"
            cur.execute(sql, params)
            for ltype, user, ts in cur.fetchall():
                filtered.append((ltype, name_map.get(user, user), fmt_sgt(ts)))
        return filtered

    def db_upsert_name_map(extracted, real):
        with get_conn() as conn, conn.cursor() as cur:
            cur.execute("""
                INSERT INTO name_map (extracted_name, real_name)
                VALUES (%s, %s)
                ON CONFLICT (extracted_name) DO UPDATE SET real_name = EXCLUDED.real_name
            """, (extracted, real))
            conn.commit()

    def db_fetch_all_mappings():
        with get_conn() as conn, conn.cursor() as cur:
            cur.execute("SELECT extracted_name, real_name FROM name_map ORDER BY extracted_name")
            return cur.fetchall()

else:
    # Linux -> SQLite
    import sqlite3
    DB_PATH = os.environ.get("SQLITE_DB_PATH", "license_usage.db")

    def init_db():
        with sqlite3.connect(DB_PATH) as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS usage (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    product_type TEXT,
                    user_name TEXT,
                    connected_time TEXT,
                    scraped_at TEXT,
                    UNIQUE(product_type, user_name, connected_time)
                )
            """)
            conn.execute("""
                CREATE TABLE IF NOT EXISTS name_map (
                    extracted_name TEXT PRIMARY KEY,
                    real_name TEXT
                )
            """)
            conn.commit()

    def db_fetch_name_map():
        with sqlite3.connect(DB_PATH) as conn:
            return dict(conn.execute("SELECT extracted_name, real_name FROM name_map"))

    def db_upsert_usage(rows):
        # rows: list of tuples (product_type, user_name, connected_time(str), scraped_at(str))
        with sqlite3.connect(DB_PATH) as conn:
            cur = conn.cursor()
            for r in rows:
                cur.execute("""
                    INSERT OR IGNORE INTO usage (product_type, user_name, connected_time, scraped_at)
                    VALUES (?, ?, ?, ?)
                """, r)
            conn.commit()

    def db_query_filtered(user_query, license_query, start_date, end_date, name_map):
        filtered = []
        with sqlite3.connect(DB_PATH) as conn:
            cur = conn.cursor()
            q = "SELECT product_type, user_name, connected_time FROM usage WHERE 1=1"
            params = []
            if user_query:
                q += " AND LOWER(user_name) LIKE ?"
                params.append(f"%{user_query.lower()}%")
            if license_query:
                q += " AND LOWER(product_type) = ?"
                params.append(license_query.lower())
            if start_date:
                q += " AND datetime(connected_time) >= datetime(?)"
                params.append(start_date)
            if end_date:
                q += " AND datetime(connected_time) < datetime(date(?, '+1 day'))"
                params.append(end_date)
            for ltype, user, ts in cur.execute(q, params):
                filtered.append((ltype, name_map.get(user, user), ts))
        return filtered

    def db_upsert_name_map(extracted, real):
        with sqlite3.connect(DB_PATH) as conn:
            conn.execute("""
                INSERT OR REPLACE INTO name_map (extracted_name, real_name)
                VALUES (?, ?)
            """, (extracted, real))
            conn.commit()

    def db_fetch_all_mappings():
        with sqlite3.connect(DB_PATH) as conn:
            return conn.execute("SELECT extracted_name, real_name FROM name_map ORDER BY extracted_name").fetchall()

# -------------------------
# Shared helpers
# -------------------------
PID_MAPPING = {
    "MUENCIV0001516": "Midas Civil / Civil NX",
    "MUENCNX0000328": "Midas Civil / Civil NX",
    "MUENCIV0002267": "Midas Civil / Civil NX - Additional",
    "MUENCNX0000327": "Midas Civil / Civil NX - Additional"
}
TOTALS = {"Midas Civil / Civil NX": 12, "Midas Civil / Civil NX - Additional": 5}
PIDS = ["MUENCIV0001516", "MUENCNX0000328", "MUENCIV0002267", "MUENCNX0000327"]

def convert_to_sgt(utc_str):
    """
    Convert 'MM/DD/YYYY HH:MM(:SS)? [GMT]' -> aware SGT datetime (Windows) or string (Linux).
    We'll return a tz-aware datetime; for Linux we'll format to str later for SQLite.
    """
    try:
        clean = utc_str.replace("GMT", "").strip()
        parts = clean.split()
        if len(parts) >= 2:
            date_part = parts[0]
            time_part = parts[1]
            comps = time_part.split(":")
            while len(comps) < 3:
                comps.append("0")
            comps = [f"{int(c):02d}" for c in comps]
            time_part = ":".join(comps)
            clean = f"{date_part} {time_part}"
        naive = datetime.strptime(clean, "%m/%d/%Y %H:%M:%S")
        utc_dt = naive.replace(tzinfo=UTC)
        return utc_dt.astimezone(SGT)
    except Exception as e:
        print("Error parsing time:", utc_str, e)
        return None


def fmt_sgt(dt):
    if not dt or pd.isna(dt):
        return ""
    if isinstance(dt, str):
        return dt
    return dt.astimezone(SGT).strftime("%Y-%m-%d %H:%M:%S")


def build_driver():
    options = Options()
    options.add_argument("--headless=new")
    if IS_LINUX:
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        from selenium.webdriver.chrome.service import Service
        chromedriver_path = os.environ.get("CHROMEDRIVER_PATH", "/usr/bin/chromedriver")
        service = Service(chromedriver_path)
        return webdriver.Chrome(service=service, options=options)
    # Windows (or others with local Chrome on PATH)
    return webdriver.Chrome(options=options)

def fetch_pages(pids):
    driver = build_driver()
    results = {}
    try:
        for pid in pids:
            combined_html = ""
            for pg in [1, 2]:
                url = f"https://account.midasuser.com/user_en/contract_exec_pguser.asp?pg={pg}&strPID={pid}"
                driver.get(url)
                time.sleep(1)
                if "login" in driver.current_url:
                    try:
                        driver.execute_script("""
                            ['modalEmailLogin','dim','hs-eu-cookie-disclaimer','hs-eu-cookie-confirmation-inner']
                            .forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'none'; });
                        """)
                        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.NAME, "strID")))
                        driver.find_element(By.NAME, "strID").send_keys(MIDAS_ID)
                        driver.find_element(By.NAME, "strPWD").send_keys(MIDAS_PWD)
                        WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.CLASS_NAME, "login_btn"))).click()
                        time.sleep(1)
                    except Exception as e:
                        print(f"Login error: {e}")
                        continue
                combined_html += driver.page_source
            results[pid] = combined_html
    finally:
        driver.quit()
    return results

def parse_table_html(results_dict):
    parsed_data = []
    for key, html_content in results_dict.items():
        soup = BeautifulSoup(html_content, "html.parser")
        rows = soup.find_all("ul", class_="li_row")
        for i, row in enumerate(rows):
            if i == 0:
                continue  # header
            cols = [li.get_text(strip=True).replace('\n', ' ') for li in row.find_all("li")]
            if cols:
                parsed_data.append([key] + cols)
    # Build DataFrame
    full_columns = ["Record ID", "TSS", "Product ID", "User Name", "ID", "Connected Time", "Disconnection"]
    if parsed_data:
        df = pd.DataFrame(parsed_data, columns=full_columns[:len(parsed_data[0])])
        df = df[["Record ID", "Product ID", "User Name", "Connected Time"]]
    else:
        df = pd.DataFrame(columns=["Record ID", "Product ID", "User Name", "Connected Time"])
    # Map to product types
    df["Product Type"] = df["Record ID"].map(PID_MAPPING).fillna(df["Product ID"])
    df = df[["Product Type", "User Name", "Connected Time"]]
    # Convert times
    df["Connected Time"] = df["Connected Time"].apply(convert_to_sgt)
    df = df[df["Connected Time"].notna()]
    return df

TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <title>License Users</title>
    <style>
        body { font-family: Arial; margin: 20px; }
        table { border-collapse: collapse; width: 90%; margin: 20px auto; }
        th, td { border: 1px solid #ccc; padding: 10px; }
        th { background-color: #f0f0f0; }
        form { text-align: center; margin: 20px auto; }
        input, select { padding: 6px; margin: 0 8px; }
    </style>
</head>
<body>

<h3 style="text-align:center;">Midas Civil / Civil NX</h3>
<table>
    <tr><th>#</th><th>License Type</th><th>Username</th><th>Connected Time (SGT)</th></tr>
    {% set count = 1 %}
    {% for row in display_rows if row[0] == "Midas Civil / Civil NX" %}
    <tr>
        <td>{{ count }}</td>
        <td>{{ row[0] }}</td>
        <td>{{ row[1] }}</td>
        <td>{{ row[2] }}</td>
    </tr>
    {% set count = count + 1 %}
    {% endfor %}
</table>
<p style="text-align:center;">Total {{ totals['Midas Civil / Civil NX'] }} licenses; currently {{ grouped['Midas Civil / Civil NX']|length }} in use.</p>

<h3 style="text-align:center;">Midas Civil / Civil NX - Additional</h3>
<table>
    <tr><th>#</th><th>License Type</th><th>Username</th><th>Connected Time (SGT)</th></tr>
    {% set count = 1 %}
    {% for row in display_rows if row[0] == "Midas Civil / Civil NX - Additional" %}
    <tr>
        <td>{{ count }}</td>
        <td>{{ row[0] }}</td>
        <td>{{ row[1] }}</td>
        <td>{{ row[2] }}</td>
    </tr>
    {% set count = count + 1 %}
    {% endfor %}
</table>
<p style="text-align:center;">Total {{ totals['Midas Civil / Civil NX - Additional'] }} licenses; currently {{ grouped['Midas Civil / Civil NX - Additional']|length }} in use.</p>

<form method="get" action="/">
    <label>User Name: <input type="text" name="user" value="{{ request.args.get('user', '') }}"></label>
    <label>License Type:
        <select name="license">
            <option value="">-- All --</option>
            <option value="Midas Civil / Civil NX" {% if request.args.get('license') == 'Midas Civil / Civil NX' %}selected{% endif %}>Midas Civil / Civil NX</option>
            <option value="Midas Civil / Civil NX - Additional" {% if request.args.get('license') == 'Midas Civil / Civil NX - Additional' %}selected{% endif %}>Midas Civil / Civil NX - Additional</option>
        </select>
    </label>
    <label>Start Date: <input type="date" name="start" value="{{ request.args.get('start', '') }}"></label>
    <label>End Date: <input type="date" name="end" value="{{ request.args.get('end', '') }}"></label>
    <button type="submit">Search</button>
</form>

{% if request.args %}
<h3 style="text-align:center;">Filtered Results</h3>
{% if filtered %}
<table>
    <tr><th>License Type</th><th>User Name</th><th>Connected Time</th></tr>
    {% for r in filtered %}
    <tr><td>{{ r[0] }}</td><td>{{ r[1] }}</td><td>{{ r[2] }}</td></tr>
    {% endfor %}
</table>
{% else %}
<p style="text-align:center;">No results found.</p>
{% endif %}
{% endif %}

<p style="text-align:center;margin-top:30px;"><a href="/map-names">Manage Name Mapping</a></p>

</body>
</html>
"""

# -------------------------
# Routes
# -------------------------
@app.route("/", methods=["GET"])
def index():
    init_db()

    # 1) Fetch and parse current pages
    pages = fetch_pages(PIDS)
    df = parse_table_html(pages)

    # 2) Load name mappings
    name_map = db_fetch_name_map()

    # 3) Display mapping for UI
    df["User Name"] = df["User Name"].apply(lambda x: name_map.get(x, x))

    # 4) Grouped counts
    grouped = {"Midas Civil / Civil NX": [], "Midas Civil / Civil NX - Additional": []}
    for _, row in df.iterrows():
        pid = row["Product Type"]
        user = name_map.get(row["User Name"], row["User Name"])
        if pid in grouped:
            grouped[pid].append(user)

    # 5) Display rows (format time)
    display_rows = []
    for _, r in df.iterrows():
        display_rows.append([r["Product Type"], r["User Name"], fmt_sgt(r["Connected Time"])])

    # 6) Upsert fresh scraped data to DB
    now_sgt_dt = datetime.now(SGT)
    if IS_WINDOWS:
        records = [
            (r["Product Type"], name_map.get(r["User Name"], r["User Name"]), r["Connected Time"], now_sgt_dt)
            for _, r in df.iterrows()
            if r["Connected Time"]  # skip None
        ]
    else:
        # store as strings in SQLite
        records = [
            (r["Product Type"], name_map.get(r["User Name"], r["User Name"]), fmt_sgt(r["Connected Time"]),
             now_sgt_dt.strftime("%Y-%m-%d %H:%M:%S"))
            for _, r in df.iterrows()
            if r["Connected Time"]
        ]
    db_upsert_usage(records)

    # 7) Filtering from DB
    user_query = request.args.get("user", "").strip()
    license_query = request.args.get("license", "").strip()
    start_date = request.args.get("start", "").strip()
    end_date = request.args.get("end", "").strip()
    filtered = db_query_filtered(user_query, license_query, start_date, end_date, name_map)

    return render_template_string(
        TEMPLATE,
        grouped=grouped,
        totals=TOTALS,
        filtered=filtered,
        display_rows=display_rows
    )

@app.route("/map-names", methods=["GET", "POST"])
def map_names():
    init_db()
    message = ""
    if request.method == "POST":
        extracted = request.form.get("extracted_name", "").strip()
        real = request.form.get("real_name", "").strip()
        if extracted and real:
            db_upsert_name_map(extracted, real)
            message = f"Mapped '{extracted}' to '{real}'"

    mappings = db_fetch_all_mappings()

    return render_template_string("""
    <h2 style="text-align:center;">Name Mapping</h2>
    <form method="post" style="text-align:center;">
        <label>Extracted Name: <input name="extracted_name" required></label>
        <label>Real Name: <input name="real_name" required></label>
        <button type="submit">Add / Update</button>
    </form>
    <p style="text-align:center; color:green;">{{ message }}</p>

    <table border=1 style="margin:auto; margin-top:20px;">
        <tr><th>Extracted Name</th><th>Real Name</th></tr>
        {% for e, r in mappings %}
        <tr><td>{{ e }}</td><td>{{ r }}</td></tr>
        {% endfor %}
    </table>
    <p style="text-align:center;"><a href="/">Back to Dashboard</a></p>
    """, mappings=mappings, message=message)

# -------------------------
# Entrypoint
# -------------------------
if __name__ == "__main__":
    init_db()
    # Default port 5000 on Windows, 5006 on Linux (match your originals)
    port = int(os.environ.get("PORT", 5000 if IS_WINDOWS else 5006))
    app.run(host="0.0.0.0", port=port, debug=True)
