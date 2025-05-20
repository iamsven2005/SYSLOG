
---

# 📘 Logging & Monitoring Stack – Setup & Usage Guide

---

## 📦 1. Prerequisites

* Docker & Docker Compose installed
* Directory containing:

  * `docker-compose.yml`
  * `prometheus.yml`
  * `alert.rules.yml`
  * `alertmanager.yml`
  * `promtail-config.yml`
  * `fluent-bit.conf`

---

## 🚀 2. Running the Stack

In your project directory:

```bash
docker compose up -d
```

This starts all services in detached mode.

To restart everything:

```bash
docker compose down
docker compose up -d
```

To view logs for any service:

```bash
docker compose logs -f <service-name>
```

---

## 🔗 3. Service Ports

| Service               | URL                                              | Notes                              |
| --------------------- | ------------------------------------------------ | ---------------------------------- |
| Grafana               | [http://localhost:3000](http://localhost:3000)   | Default user: `admin` / `admin`    |
| Prometheus            | [http://localhost:9090](http://localhost:9090)   | Metrics browser                    |
| Alertmanager          | [http://localhost:9093](http://localhost:9093)   | Alert routing config               |
| RabbitMQ              | [http://localhost:15672](http://localhost:15672) | User: `admin` / `admin`            |
| Elasticsearch         | [http://localhost:9200](http://localhost:9200)   | Stores Fluent Bit logs             |
| Loki                  | [http://localhost:3100](http://localhost:3100)   | Stores Promtail/Fluent Bit logs    |
| PostgreSQL (pgvector) | localhost:5433                                   | DB: `logs_database`, User: `admin` |

---

## 🧭 4. Log Flow Overview

```text
[Windows/Linux Device Logs]
         ↓
  Promtail or Fluent Bit
         ↓
    ┌──────────────┐
    │              │
    ↓              ↓
 [Loki]         [Elasticsearch]
    ↓              ↓
  Grafana (Log queries, dashboards)

[Metrics Exporters (e.g., node_exporter, rabbitmq_exporter)]
         ↓
      Prometheus
         ↓
      Grafana + Alertmanager
```

---

## 🪵 5. How to Collect Logs from Devices

### 🖥️ From Windows

* Use **Promtail** or **Fluent Bit**
* Point to:

  * IIS Logs: `C:/inetpub/logs/LogFiles/W3SVC1/*.log`
  * Event Viewer (converted): `C:/logs/exported/*.txt`
* Output logs to Loki or Elasticsearch using provided config generator script.

### 🖥️ From Linux

* Mount `/var/log/` into Promtail or Fluent Bit
* Output to `loki:3100` or `elasticsearch:9200`

---

## 📁 6. Where Logs Are Stored

| Source     | Format           | Location                        | Query Tool                 |
| ---------- | ---------------- | ------------------------------- | -------------------------- |
| Promtail   | Plain text logs  | Loki (inside Docker volume)     | Grafana                    |
| Fluent Bit | Structured logs  | Elasticsearch volume index      | Grafana/Kibana (if set up) |
| Metrics    | Time series      | Prometheus (RAM + TSDB)         | Grafana                    |
| Alerts     | Rule definitions | `alert.rules.yml`               | Alertmanager               |
| DB Storage | Vectors + data   | `pgvector-db` (`logs_database`) | Custom apps                |

---

## 🛠️ 7. Useful Commands

### Logs

```bash
docker compose logs -f promtail
docker compose logs -f fluent-bit
```

### Connect to PostgreSQL

```bash
psql -h localhost -p 5433 -U admin -d logs_database
```

---

## ⚠️ 8. Alerts (Default Rules)

| Alert Name              | Trigger Condition             | Action       |
| ----------------------- | ----------------------------- | ------------ |
| `InstanceDown`          | Any Prometheus target is down | Alertmanager |
| `HighCPUUsage`          | CPU > 80% for 2 min           | Alertmanager |
| `HighMemoryUsage`       | RAM usage > 85% for 2 min     | Alertmanager |
| `RabbitMQQueueTooLarge` | Queued messages > 500         | Alertmanager |

Email/Slack routing can be configured in `alertmanager.yml`.

---

## 📊 9. Dashboards to Import in Grafana

* **Prometheus Node Exporter Full**: ID `1860`
* **Loki Log Browser**: ID `13639`
* Add custom dashboards for:

  * Windows logs
  * RabbitMQ stats
  * Disk usage or CPU from Prometheus

---

## 📌 10. Next Steps

* ✅ Set up **log rotation & retention policies**
* ✅ Connect `pgvector` to OpenAI for semantic log search
* ✅ Add **Kibana** for Elasticsearch UI
* ✅ Extend Fluent Bit to parse IIS or NGINX logs with custom parsers


## IMAGE EXTRACTION

For blip

# Download Miniconda (Python 3.9, Linux x86_64)
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh

# Make it executable
chmod +x Miniconda3-latest-Linux-x86_64.sh

# Run installer
./Miniconda3-latest-Linux-x86_64.sh
curl --proto '=https' --tslv1.2 -sSf https://sh.rustup.rs | sh
sudo apt install rustup


Tokenizer uses rust, make sure rust is installed here  rust-lang.org/tools/install

docker rm (docker ps -a -q)
docker compose up -d

# for pg vector
docker exec -it pgvector-db psql -U admin -d logs_database

CREATE EXTENSION IF NOT EXISTS vector;
