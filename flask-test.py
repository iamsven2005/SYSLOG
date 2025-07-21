from flask import Flask, Response, request
import subprocess
import threading
import time
import json
import csv
import io
import sqlite3
import os
app = Flask(__name__)

traffic_data = {}
monitored_ports = set()
lock = threading.Lock()


def init_db():
    if not os.path.exists("traffic.db"):
        print("Creating traffic.db...")
        conn = sqlite3.connect("traffic.db")
        c = conn.cursor()
        c.execute('''CREATE TABLE IF NOT EXISTS traffic (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            port INTEGER,
            timestamp TEXT,
            ingress INTEGER,
            egress INTEGER,
            connections INTEGER
        )''')
        conn.commit()
        conn.close()
    else:
        print("traffic.db already exists.")

def insert_traffic(port, timestamp, ingress, egress, connections):
    conn = sqlite3.connect("traffic.db")
    c = conn.cursor()
    c.execute("INSERT INTO traffic (port, timestamp, ingress, egress, connections) VALUES (?, ?, ?, ?, ?)",
              (port, timestamp, ingress, egress, connections))
    conn.commit()
    conn.close()


def count_connections(port):
    try:
        result = subprocess.run(
            ["ss", "-Htan"],
            stdout=subprocess.PIPE,
            stderr=subprocess.DEVNULL,
            text=True
        )
        lines = result.stdout.strip().split("\n")
        return sum(1 for line in lines if f":{port} " in line or f":{port}\n" in line)
    except Exception:
        return 0


def monitor_tcpdump(port):
    with lock:
        traffic_data[port] = {
            "timestamps": [],
            "ingress": [],
            "egress": [],
            "connections": []
        }

    cmd = ["tcpdump", "-i", "any", f"port {port}", "-l"]
    process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, text=True)
    idle_count = 0
    while True:
        line = process.stdout.readline()
        if not line:
            break

        direction = "ingress" if "IP" in line and ">" in line else "egress"
        now = time.strftime("%Y-%m-%d %H:%M:%S")

        with lock:
            td = traffic_data[port]
            td["connections"].append(count_connections(port))

            if len(td["timestamps"]) > 20:
                for key in td:
                    td[key].pop(0)

            td["timestamps"].append(now)
            if direction == "ingress":
                td["ingress"].append(td["ingress"][-1] + 1 if td["ingress"] else 1)
                td["egress"].append(td["egress"][-1] if td["egress"] else 0)
            else:
                td["egress"].append(td["egress"][-1] + 1 if td["egress"] else 1)
                td["ingress"].append(td["ingress"][-1] if td["ingress"] else 0)

            insert_traffic(
                port, now,
                td["ingress"][-1],
                td["egress"][-1],
                td["connections"][-1]
            )
            conn = count_connections(port)
            td["connections"].append(conn)

            if conn == 0:
                idle_count += 1
            else:
                idle_count = 0

            if idle_count >= 10:  # ~10s idle timeout
                print(f"Stopping monitor for port {port} (inactive)")
                monitored_ports.discard(port)
                traffic_data.pop(port, None)
                break


@app.route("/")
def index():
    chart_divs = ""
    for port in monitored_ports:
        chart_divs += f"""
        <h3>Port {port} - Connections: <span id="conn-{port}">0</span></h3>
        <canvas id="chart-{port}" height="100"></canvas>
        <script>
        const chart{port} = new Chart(document.getElementById('chart-{port}').getContext('2d'), {{
            type: 'line',
            data: {{
                labels: [],
                datasets: [
                    {{ label: 'Ingress', borderColor: 'blue', data: [], fill: false }},
                    {{ label: 'Egress', borderColor: 'green', data: [], fill: false }},
                    {{ label: 'Connections', borderColor: 'red', data: [], fill: false }}
                ]
            }},
            options: {{ responsive: true, animation: false }}
        }});
        const evtSource{port} = new EventSource("/stream/{port}");
        evtSource{port}.onmessage = function(event) {{
            let data = JSON.parse(event.data);
            chart{port}.data.labels = data.timestamps;
            chart{port}.data.datasets[0].data = data.ingress;
            chart{port}.data.datasets[1].data = data.egress;
            chart{port}.data.datasets[2].data = data.connections;
            chart{port}.update();
            document.getElementById("conn-{port}").textContent = data.connections.at(-1) || 0;
        }};
        </script>
        <br>
        """

    return f"""
    <head>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    </head>
    <h2>Monitor TCP Ports</h2>
    <form method="post" action="/add_port">
        <input name="port" type="text" required />
        <button type="submit">Add Port</button>
    </form>
    {chart_divs}
    <a href="/export" target="_blank">Download All Data (CSV)</a>
    """


@app.route("/add_port", methods=["POST"])
def add_port():
    port = request.form.get("port")
    if not port or not port.isdigit():
        return "Invalid port", 400
    port = int(port)
    if port not in monitored_ports:
        monitored_ports.add(port)
        threading.Thread(target=monitor_tcpdump, args=(port,), daemon=True).start()
    return f'<meta http-equiv="refresh" content="0; URL=/?port={port}">'


@app.route("/stream/<int:port>")
def stream(port):
    def event_stream():
        while True:
            time.sleep(1)
            with lock:
                if port in traffic_data:
                    yield f"data: {json.dumps(traffic_data[port])}\n\n"
    return Response(event_stream(), mimetype="text/event-stream")


@app.route("/export")
def export_csv():
    conn = sqlite3.connect("traffic.db")
    c = conn.cursor()
    c.execute("SELECT port, timestamp, ingress, egress, connections FROM traffic ORDER BY port, timestamp")
    rows = c.fetchall()
    conn.close()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["port", "timestamp", "ingress", "egress", "connections"])
    writer.writerows(rows)
    output.seek(0)
    return Response(output, mimetype='text/csv',
                    headers={"Content-Disposition": "attachment;filename=traffic_data.csv"})

@app.route("/remove_port", methods=["POST"])
def remove_port():
    data = request.get_json()
    port = data.get("port")
    with lock:
        monitored_ports.discard(port)
        traffic_data.pop(port, None)
    return "OK"



if __name__ == "__main__":
    init_db()
    app.run(debug=True, threaded=True)
