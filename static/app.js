async function getWeather() {

    const city = document.getElementById("cityInput").value;

    if (!city) {
        return;
    }

    try {

        const response = await fetch(
            `/api/weather?city=${encodeURIComponent(city)}`
        );

        if (!response.ok) {
            throw new Error("City not found");
        }

        const data = await response.json();

        const current = data.current;

        document.getElementById("location").textContent =
            `${data.city}, ${data.state || data.country}`;

        document.getElementById("temperature").textContent =
            `${current.temperature_2m}°F`;

        document.getElementById("feelsLike").textContent =
            `${current.apparent_temperature}°F`;

        document.getElementById("humidity").textContent =
            `${current.relative_humidity_2m}%`;

        document.getElementById("wind").textContent =
            `${current.wind_speed_10m} mph`;

        document.getElementById("precipitation").textContent =
            `${current.precipitation} mm`;

        document.getElementById("conditions").textContent =
            getWeatherDescription(current.weather_code);

    } catch (error) {

        document.getElementById("conditions").textContent =
            "Unable to find that city.";

        console.error(error);
    }
}


function getWeatherDescription(code) {

    const descriptions = {
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Fog",
        48: "Depositing rime fog",
        51: "Light drizzle",
        53: "Moderate drizzle",
        55: "Dense drizzle",
        61: "Slight rain",
        63: "Moderate rain",
        65: "Heavy rain",
        71: "Slight snow",
        73: "Moderate snow",
        75: "Heavy snow",
        80: "Rain showers",
        81: "Moderate rain showers",
        82: "Violent rain showers",
        95: "Thunderstorm"
    };

    return descriptions[code] || "Unknown conditions";
}


getWeather();