import requests
import pandas as pd
import urllib3
 
# Disable SSL warnings for self-signed/local certs
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
 
# --- Config ---
GITEA_URL = "https://localhost:3000"
API_TOKEN = "e4bf6c8cc849c41cf10b6b2166910cd745b8de4b"
OWNER = "iamsven2005"
REPO = "wci"
 
headers = {"Authorization": f"token {API_TOKEN}"}
 
# --- Get ALL issues ---
url = f"{GITEA_URL}/api/v1/repos/{OWNER}/{REPO}/issues?state=all&limit=9999"
resp = requests.get(url, headers=headers, verify=False)
resp.raise_for_status()
issues = resp.json()
 
report_rows = []
 
# --- Process issues ---
for i in issues:
    issue_number = i["number"]
 
    # --- Get comments ---
    comments_url = f"{GITEA_URL}/api/v1/repos/{OWNER}/{REPO}/issues/{issue_number}/comments"
    comments = requests.get(comments_url, headers=headers, verify=False).json()
 
    # First + last posts
    first_post_text = i["body"] if i["body"] else ""
    first_post_user = i["user"]["login"] if i.get("user") else None
    last_post_text = comments[-1]["body"] if comments else ""
    last_post_user = comments[-1]["user"]["login"] if comments else None
 
    first_post = f"{first_post_user}: {first_post_text}" if first_post_user else first_post_text
    last_post = f"{last_post_user}: {last_post_text}" if last_post_user else last_post_text
 
    # --- Build issue link ---
    issue_link = f"{GITEA_URL}/{OWNER}/{REPO}/issues/{issue_number}"
    issue_label = f"[{issue_number}] {i['title']}"
 
    # --- Dependencies ---
    deps_url = f"{GITEA_URL}/api/v1/repos/{OWNER}/{REPO}/issues/{issue_number}/dependencies"
    try:
        deps = requests.get(deps_url, headers=headers, verify=False).json()
        dependencies = [d.get("number") for d in deps] if isinstance(deps, list) else []
    except Exception:
        dependencies = []
 
    # --- Other info ---
    pr_info = i.get("pull_request")
    references = pr_info.get("url") if isinstance(pr_info, dict) else None
    projects = [p.get("title") for p in i.get("projects", [])] if "projects" in i else []
 
    report_rows.append({
        "id": i["id"],  # keep id
        "issue": issue_link,  # raw link (hidden later, used for Excel hyperlink)
        "issue_label": issue_label,  # display text
        "state": i["state"],
        "labels": [lbl["name"] for lbl in i.get("labels", [])],
        "milestone": i["milestone"]["title"] if i.get("milestone") else None,
        "projects": projects,
        "due_date": i.get("due_date"),
        "dependencies": dependencies,
        "references": references,
        "assignee": i["assignee"]["login"] if i.get("assignee") else None,
        "creator": first_post_user,
        "created_at": i["created_at"],
        "updated_at": i["updated_at"],
        "first_post": first_post,
        "last_post": last_post,
    })
 
# --- Create DataFrame ---
df = pd.DataFrame(report_rows)
 
# Rename "issue_label" → "issue" for Excel export
df_no_raw = df.drop(columns=["issue"]).rename(columns={"issue_label": "issue"})
 
# --- Save to Excel with hyperlink formatting ---
output_file = "gitea_issues_detailed_report.xlsx"
with pd.ExcelWriter(output_file, engine="xlsxwriter") as writer:
    df_no_raw.to_excel(writer, sheet_name="Issues", index=False, startrow=1, header=False)
    workbook = writer.book
    worksheet = writer.sheets["Issues"]
 
    # Write headers manually
    for col_num, value in enumerate(df_no_raw.columns.values):
        worksheet.write(0, col_num, value)
 
    # Find the column index of "issue"
    issue_col_idx = df_no_raw.columns.get_loc("issue")
 
    # Add clickable hyperlink in "issue" column
    for row in range(len(df_no_raw)):
        link = df.at[row, "issue"]              # raw link (from original df)
        label = df_no_raw.at[row, "issue"]      # label (renamed column)
        worksheet.write_url(row + 1, issue_col_idx, link, string=label)
 
print(f"Detailed report saved as {output_file}")
