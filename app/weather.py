import httpx


GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search"
WEATHER_URL = "https://api.open-meteo.com/v1/forecast"


async def get_weather(city: str):
    async with httpx.AsyncClient() as client:
        # Find the city's latitude and longitude
        geo_response = await client.get(
            GEOCODING_URL,
            params={
                "name": city,
                "count": 1,
                "language": "en",
                "format": "json",
            },
        )

        geo_response.raise_for_status()
        geo_data = geo_response.json()

        if "results" not in geo_data:
            return None

        location = geo_data["results"][0]

        latitude = location["latitude"]
        longitude = location["longitude"]

        # Get the weather for those coordinates
        weather_response = await client.get(
            WEATHER_URL,
            params={
                "latitude": latitude,
                "longitude": longitude,
                "current": [
                    "temperature_2m",
                    "relative_humidity_2m",
                    "apparent_temperature",
                    "precipitation",
                    "weather_code",
                    "wind_speed_10m",
                ],
                "temperature_unit": "fahrenheit",
                "wind_speed_unit": "mph",
                "timezone": "auto",
            },
        )

        weather_response.raise_for_status()

        weather_data = weather_response.json()

        return {
            "city": location["name"],
            "state": location.get("admin1"),
            "country": location.get("country"),
            "latitude": latitude,
            "longitude": longitude,
            "current": weather_data["current"],
        }
