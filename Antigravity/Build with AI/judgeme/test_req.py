import requests

url = "http://localhost:8000/simulate"
data = {
    "crime": "Stole a bicycle",
    "priors": "1 prior",
    "employment": "Employed",
    "base_income": "12L",
    "base_age": "28"
}

response = requests.post(url, json=data)
print(response.status_code)
print(response.text)
