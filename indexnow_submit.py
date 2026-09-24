import os
import json
import urllib.request
import urllib.error
import xml.etree.ElementTree as ET

# Configuration
HOST = "stickmanclimb2.github.io"
KEY = "38c4c3f0ee424712bb31380b26d9d016"
KEY_LOCATION = f"https://{HOST}/{KEY}.txt"

# IndexNow API Endpoints
ENDPOINTS = [
    "https://api.indexnow.org/indexnow",
    "https://www.bing.com/indexnow"
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
            # Ensure proper URL formatting
            if not url.startswith("http"):
                url = f"https://{url}"
            urls.append(url)
    
    # Deduplicate while preserving order
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

    print(f"\n==============================================")
    print(f"  Submitting {len(urls)} URLs to IndexNow")
    print(f"  Host: {HOST}")
    print(f"  Key: {KEY}")
    print(f"  Key Location: {KEY_LOCATION}")
    print(f"==============================================\n")

    payload = {
        "host": HOST,
        "key": KEY,
        "keyLocation": KEY_LOCATION,
        "urlList": urls
    }

    data = json.dumps(payload, indent=2).encode('utf-8')

    for endpoint in ENDPOINTS:
        print(f"Sending request to: {endpoint} ...")
        req = urllib.request.Request(
            endpoint,
            data=data,
            headers={
                "Content-Type": "application/json; charset=utf-8",
                "User-Agent": "IndexNowSubmitter/1.0"
            }
        )

        try:
            with urllib.request.urlopen(req) as resp:
                status = resp.status
                body = resp.read().decode('utf-8')
                print(f"✅ Success! Response Status: {status}")
                if status == 200:
                    print("   HTTP 200: OK - URLs submitted and queued for immediate indexing.")
                elif status == 202:
                    print("   HTTP 202: Accepted - IndexNow key verified and URLs received.")
                if body:
                    print(f"   Response Body: {body}")
        except urllib.error.HTTPError as e:
            print(f"❌ HTTP Error {e.code}: {e.reason}")
            err_body = e.read().decode('utf-8', errors='ignore')
            if e.code == 403:
                print("   Explanation: The key was not found or invalid on your live site.")
                print(f"   Make sure {KEY_LOCATION} is live and returns HTTP 200 before submitting.")
            elif e.code == 400:
                print("   Explanation: Invalid JSON format or missing parameters.")
            elif e.code == 422:
                print("   Explanation: One or more URLs do not match the specified host.")
            if err_body:
                print(f"   Details: {err_body}")
        except Exception as e:
            print(f"❌ Connection Error: {e}")

if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    sitemap_file = os.path.join(current_dir, "sitemap.xml")
    url_list = load_urls_from_sitemap(sitemap_file)
    submit_indexnow(url_list)
