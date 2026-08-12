from pydantic import BaseModel
class SimulationRequest(BaseModel):
    crime: str
    priors: str
    employment: str
    base_income: str
    base_age: str

try:
    SimulationRequest(crime="test", priors="None", employment="Employed", base_income="12L", base_age=28)
    print("Success")
except Exception as e:
    print("Error:", e)
