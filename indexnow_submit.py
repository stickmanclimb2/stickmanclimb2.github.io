import os
import json
import urllib.request
import urllib.error
import xml.etree.ElementTree as ET

# Configuration
HOST = "stickmanclimb2.github.io"
KEY = "38c4c3f0ee424712bb31380b26d9d016"
KEY_LOCATION = f"https://{HOST}/{KEY}.txt"

ENDPOINTS = [
    "https://www.bing.com/indexnow",
    "https://api.indexnow.org/indexnow"
]

def load_urls_from_sitemap(sitemap_path):
    if not os.path.exists(sitemap_path):
        print(f"Error: {sitemap_path} does not exist.")
        return []
    
    tree = ET.parse(sitemap_path)
    root = tree.getroot()
    urls = []
    for elem in root.iter('{http://www.sitemaps.org/schemas/sitemap/0.9}loc'):
        if elem.text:
            url = elem.text.strip()
            if not url.startswith("http"):
                url = f"https://{url}"
            urls.append(url)
    
    seen = set()
    deduped = []
    for u in urls:
        if u not in seen:
            seen.add(u)
            deduped.append(u)
    return deduped

def submit_indexnow(urls):
    if not urls:
        print("No URLs found to submit.")
        return

    print("==============================================")
    print(f"  Submitting {len(urls)} URLs to IndexNow")
    print(f"  Host: {HOST}")
    print(f"  Key: {KEY}")
    print(f"  Key Location: {KEY_LOCATION}")
    print("==============================================\n")

    payload = {
        "host": HOST,
        "key": KEY,
        "keyLocation": KEY_LOCATION,
        "urlList": urls
    }

    data = json.dumps(payload, indent=2).encode('utf-8')

    for endpoint in ENDPOINTS:
        print(f"Submitting to: {endpoint} ...")
        req = urllib.request.Request(
            endpoint,
            data=data,
            headers={
                "Content-Type": "application/json; charset=utf-8",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
            }
        )

        try:
            with urllib.request.urlopen(req) as resp:
                status = resp.status
                body = resp.read().decode('utf-8', errors='ignore')
                print(f"[OK] Success! HTTP Status: {status}")
                if status == 200:
                    print("     URLs successfully submitted and queued for indexing.")
                elif status == 202:
                    print("     Accepted: Key verified, URLs queued.")
                if body:
                    print(f"     Response: {body}")
        except urllib.error.HTTPError as e:
            print(f"[ERROR] HTTP Error {e.code}: {e.reason}")
            err_body = e.read().decode('utf-8', errors='ignore')
            if err_body:
                print(f"     Details: {err_body}")
        except Exception as e:
            print(f"[ERROR] Connection Exception: {e}")

if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    sitemap_file = os.path.join(current_dir, "sitemap.xml")
    url_list = load_urls_from_sitemap(sitemap_file)
    submit_indexnow(url_list)
