from flask import Flask, Response, render_template_string
import subprocess
import time
import threading
from collections import deque

app = Flask(__name__)

PORT = "3000"
packet_counts = deque(maxlen=60)  # Store last 60 seconds
clients = []

HTML_PAGE = """
<!DOCTYPE html>
<html>
<head>
  <title>Live tcpdump Chart</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
  <h2>TCP Traffic on Port {{ port }} (packets/sec)</h2>
  <canvas id="chart" width="800" height="400"></canvas>

  <script>
    const ctx = document.getElementById('chart').getContext('2d');
    const labels = Array.from({length: 60}, (_, i) => i - 59);
    const data = {
      labels: labels,
      datasets: [{
        label: 'Packets/sec',
        data: Array(60).fill(0),
        borderColor: 'lime',
        backgroundColor: 'rgba(0,255,0,0.2)',
        tension: 0.1
      }]
    };
    const config = {
      type: 'line',
      data: data,
      options: {
        animation: false,
        responsive: true,
        scales: {
          x: { title: { display: true, text: 'Seconds ago' } },
          y: { beginAtZero: true }
        }
      }
    };
    const myChart = new Chart(ctx, config);

    const evtSource = new EventSource("/stream");
    evtSource.onmessage = function(e) {
      const count = parseInt(e.data);
      data.datasets[0].data.push(count);
      data.datasets[0].data.shift();
      myChart.update();
    };
  </script>
</body>
</html>
"""

@app.route("/")
def index():
    return render_template_string(HTML_PAGE, port=PORT)

@app.route("/stream")
def stream():
    def event_stream():
        q = deque(maxlen=1)
        clients.append(q)
        try:
            while True:
                if q:
                    count = q.popleft()
                    yield f"data: {count}\n\n"
                time.sleep(1)
        except GeneratorExit:
            clients.remove(q)

    return Response(event_stream(), mimetype="text/event-stream")

def tcpdump_counter():
    process = subprocess.Popen(
        ["sudo", "tcpdump", "-i", "any", f"port {PORT}", "-nn", "-l"],
        stdout=subprocess.PIPE,
        stderr=subprocess.DEVNULL,
        text=True
    )

    count = 0
    last_time = time.time()

    for line in process.stdout:
        now = time.time()
        if now - last_time >= 1:
            for q in clients:
                q.append(count)
            count = 0
            last_time = now
        count += 1

# Start tcpdump thread
threading.Thread(target=tcpdump_counter, daemon=True).start()

if __name__ == "__main__":
    app.run(debug=True, threaded=True)
