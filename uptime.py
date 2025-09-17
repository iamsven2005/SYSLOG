import time
import requests
from datetime import datetime
from zoneinfo import ZoneInfo

URL = "http://www.ywlgroup.com/"
SGT = ZoneInfo("Asia/Singapore")

def is_valid_html(text: str) -> bool:
    # simple check: must contain <html> tag
    return "<html" in text.lower() and "</html>" in text.lower()

def log_now(msg: str):
    print(msg, datetime.now(SGT).strftime("%Y-%m-%d %H:%M:%S"))

def monitor():
    while True:
        try:
            resp = requests.get(URL, timeout=15)
            if resp.status_code == 200 and is_valid_html(resp.text):
                log_now("ok")
                time.sleep(300)  # wait 5 minutes (300)
            else:
                log_now("no (invalid html or status)")
                time.sleep(900)  # wait 15 minutes 900
        except Exception as e:
            log_now(f"no (exception: {e})")
            time.sleep(900)  # wait 15 minutes 900

if __name__ == "__main__":
    monitor()
