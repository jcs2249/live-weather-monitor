import pytest

from app.weather import get_weather


@pytest.mark.asyncio
async def test_get_weather_returns_data():
    result = await get_weather("Philadelphia")

    assert result is not None
    assert result["city"] == "Philadelphia"
    assert "current" in result
    assert "hourly" in result
    assert "daily" in result


@pytest.mark.asyncio
async def test_current_weather_data():
    result = await get_weather("Philadelphia")

    current = result["current"]

    assert "temperature_2m" in current
    assert "relative_humidity_2m" in current
    assert "apparent_temperature" in current
    assert "precipitation" in current
    assert "weather_code" in current
    assert "wind_speed_10m" in current


@pytest.mark.asyncio
async def test_hourly_forecast_data():
    result = await get_weather("Philadelphia")

    hourly = result["hourly"]

    assert "time" in hourly
    assert "temperature_2m" in hourly
    assert "precipitation_probability" in hourly
    assert "weather_code" in hourly
    assert "wind_speed_10m" in hourly

    assert len(hourly["time"]) > 0


@pytest.mark.asyncio
async def test_daily_forecast_data():
    result = await get_weather("Philadelphia")

    daily = result["daily"]

    assert "time" in daily
    assert "weather_code" in daily
    assert "temperature_2m_max" in daily
    assert "temperature_2m_min" in daily
    assert "precipitation_probability_max" in daily

    assert len(daily["time"]) == 7
