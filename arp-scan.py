
#!/usr/bin/env python3
import subprocess
import requests
import re
import socket
import time

API_ENDPOINT = "http://192.168.1.96:3000/api/devices"
INTERFACE = "enp0s31f6"  # adjust to your NIC (check `ip a`)

# ------------------------------------------
# Hostname resolution chain
# ------------------------------------------
def resolve_hostname(ip):
    # Try reverse DNS (PTR record)
    try:
        return socket.gethostbyaddr(ip)[0]
    except:
        pass

    # Try mDNS / Avahi (Linux, IoT, Raspberry Pi, macOS)
    try:
        mdns = subprocess.run(
            ["avahi-resolve-address", ip],
            stdout=subprocess.PIPE,
            stderr=subprocess.DEVNULL,
            text=True
        )
        if mdns.returncode == 0 and mdns.stdout.strip():
            return mdns.stdout.split()[-1]
    except:
        pass

    # Try NetBIOS (Windows / Samba)
    try:
        nmb = subprocess.run(
            ["nmblookup", "-A", ip],
            stdout=subprocess.PIPE,
            stderr=subprocess.DEVNULL,
            text=True
        )
        for line in nmb.stdout.splitlines():
            if "<00>" in line and "GROUP" not in line:
                return line.split()[0]
    except:
        pass

    return "Unknown"

# ------------------------------------------
# ARP scan + API post
# ------------------------------------------
def run_scan():
    result = subprocess.run(
        ["sudo", "arp-scan", "--interface", INTERFACE, "--localnet"],
        stdout=subprocess.PIPE,
        stderr=subprocess.DEVNULL,
        text=True
    )

    for line in result.stdout.splitlines():
        if re.search(r"([0-9a-f]{2}:){5}[0-9a-f]{2}", line.lower()):
            parts = line.split()
            if len(parts) < 2:
                continue

            ip = parts[0]
            mac = parts[1]
            vendor = " ".join(parts[2:]) if len(parts) > 2 else "Unknown"

            name = resolve_hostname(ip)

            print(f"📡 Found device: {ip} ({mac}, {name}, {vendor})")

            payload = {"ip": ip, "mac": mac, "name": name, "vendor": vendor}

            try:
                requests.post(API_ENDPOINT, json=payload, timeout=5)
            except Exception as e:
                print(f"❌ Failed to post {ip}: {e}")

# ------------------------------------------
# Main loop
# ------------------------------------------
def main():
    while True:
        run_scan()
        print("✅ Scan complete. Sleeping 5 minutes...")
        time.sleep(300)

if __name__ == "__main__":
    main()
