from fastapi import FastAPI
from fastapi.responses import JSONResponse
import matplotlib.pyplot as plt
import io
import base64
import json
import requests
from datetime import datetime

app = FastAPI()

class Senzor:
    def __init__(self, locatie_json):
        if locatie_json.startswith("http"):
            response = requests.get(locatie_json)
            date_json = json.loads(response.text)
        else:
            with open(locatie_json, "r") as file:
                date_json = json.load(file)

        self.inregistrari = date_json["data"][::-1]

    def lista_timestampuri(self):
        return [
            datetime.strptime(t, "%Y-%m-%dT%H:%M:%SZ").strftime("%Y-%m-%d %H:%M")
            for t in [inregistrare[1] for inregistrare in self.inregistrari]
        ]

    def lista_valori(self):
        return [inregistrare[2] for inregistrare in self.inregistrari]

senzori = [
    Senzor("10.json"),
    Senzor("11.json"),
    Senzor("12.json"),
]

@app.get("/")
async def root():
    return {"message": "Python Backend Running"}

@app.get("/senzor/{index}")
async def grafic(index: int):
    if index < 0 or index >= len(senzori):
        return JSONResponse(content={"error": "Invalid index"}, status_code=400)

    img = io.BytesIO()
    plt.figure(figsize=(6, 4))
    plt.xlabel("Time")
    plt.ylabel("mW")
    plt.xticks(rotation=-90)
    plt.plot(senzori[index].lista_timestampuri(), senzori[index].lista_valori())
    plt.tight_layout()
    plt.savefig(img, format="png")
    img.seek(0)

    plot_url = base64.b64encode(img.getvalue()).decode()
    return JSONResponse(content={"plot_url": f"data:image/png;base64,{plot_url}"})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
