async function getWeather() {
    const cityInput = document.getElementById("cityInput");
    const city = cityInput.value.trim();

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

        // Current weather
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
            `${current.precipitation} in`;

        document.getElementById("conditions").textContent =
            getWeatherDescription(current.weather_code);

        // Forecasts
        displayHourlyForecast(data.hourly);
        displayDailyForecast(data.daily);

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


function getWeatherEmoji(code) {
    if (code === 0) return "☀️";
    if (code === 1) return "🌤️";
    if (code === 2) return "⛅";
    if (code === 3) return "☁️";

    if (code >= 45 && code <= 48) return "🌫️";
    if (code >= 51 && code <= 67) return "🌧️";
    if (code >= 71 && code <= 77) return "❄️";
    if (code >= 80 && code <= 82) return "🌦️";
    if (code >= 95) return "⛈️";

    return "🌡️";
}


function displayHourlyForecast(hourly) {
    const container = document.getElementById("hourlyForecast");

    container.innerHTML = "";

    // Display the next 12 hours
    for (let i = 0; i < 12; i++) {
        const date = new Date(hourly.time[i]);

        const time = date.toLocaleTimeString([], {
            hour: "numeric"
        });

        const temperature = hourly.temperature_2m[i];
        const rain = hourly.precipitation_probability[i];
        const weatherCode = hourly.weather_code[i];

        const card = document.createElement("div");

        card.className = "hour-card";

        card.innerHTML = `
            <div class="time">
                ${time}
            </div>

            <div class="weather-icon">
                ${getWeatherEmoji(weatherCode)}
            </div>

            <div class="temp">
                ${temperature}°F
            </div>

            <div class="rain">
                🌧 ${rain}%
            </div>
        `;

        container.appendChild(card);
    }
}


function displayDailyForecast(daily) {
    const container = document.getElementById("dailyForecast");

    container.innerHTML = "";

    for (let i = 0; i < 7; i++) {
        const date = new Date(daily.time[i]);

        const day = date.toLocaleDateString([], {
            weekday: "short"
        });

        const high = daily.temperature_2m_max[i];
        const low = daily.temperature_2m_min[i];
        const rain = daily.precipitation_probability_max[i];
        const weatherCode = daily.weather_code[i];

        const card = document.createElement("div");

        card.className = "day-card";

        card.innerHTML = `
            <div class="day">
                ${day}
            </div>

            <div class="weather-icon">
                ${getWeatherEmoji(weatherCode)}
            </div>

            <div class="temps">
                <div class="high">
                    ${high}°F
                </div>

                <div class="low">
                    ${low}°F
                </div>
            </div>

            <div class="rain">
                🌧 ${rain}%
            </div>
        `;

        container.appendChild(card);
    }
}


getWeather(document.getElementById("cityInput").value);