import urllib.request
req = urllib.request.Request("https://judgeme-266894259350.europe-west1.run.app/health", method="OPTIONS")
req.add_header("Origin", "https://judgemee.vercel.app")
req.add_header("Access-Control-Request-Method", "GET")
try:
    with urllib.request.urlopen(req) as response:
        print(response.headers)
except Exception as e:
    print(e)
