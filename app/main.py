from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from app.weather import get_weather

app = FastAPI(title="Live Weather Monitor")

app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/")
async def root():
    return FileResponse("static/index.html")


@app.get("/api/weather")
async def weather(city: str = "Philadelphia"):
    weather_data = await get_weather(city)

    if weather_data is None:
        raise HTTPException(status_code=404, detail="City not found")

    return weather_data
