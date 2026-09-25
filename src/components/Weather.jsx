import React, { useState } from "react";
import axios from "axios";

function Weather() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const searchWeather = async () => {
    if (!city.trim()) {
      setError("Please enter a city name.");
      setWeather(null);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

      const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

      const response = await axios.get(API_URL);

      setWeather(response.data);
    } catch (err) {
      console.log("API ERROR:", err);
      console.log("STATUS:", err.response?.status);
      console.log("MESSAGE:", err.response?.data);

      setWeather(null);

      if (err.response?.status === 401) {
        setError("API key is invalid or not activated yet.");
      } else if (err.response?.status === 404) {
        setError("City not found. Please check the city name.");
      } else if (err.response?.status === 429) {
        setError("Too many requests. Please try again later.");
      } else {
        setError(
          "Unable to get weather data. Check your internet connection."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const isDay =
    weather &&
    Date.now() / 1000 >= weather.sys.sunrise &&
    Date.now() / 1000 <= weather.sys.sunset;

  return (
    <main
      className={`weather-container ${
        weather ? weather.weather[0].main.toLowerCase() : ""
      }`}
    >
      <section className="weather-card">

        {/* HEADER */}
        <header className="weather-header">
          <p className="weather-label">LIVE WEATHER</p>

          <h1>SkyPulse 🌤️</h1>

          <p>
            Discover the weather anywhere in the world.
          </p>
        </header>

        {/* SEARCH */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Enter city name..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                searchWeather();
              }
            }}
          />

          <button onClick={searchWeather}>
            Search
          </button>
        </div>

        {/* LOADING */}
        {loading && (
          <p className="message">
            Checking the sky... ☁️
          </p>
        )}

        {/* ERROR */}
        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        {/* WEATHER RESULT */}
        {weather && !loading && (
          <article className="weather-result">
            {/* TODAY'S ACTIVITY */}
<div className="activity-card">
  <h3>🎯 Today's Activity</h3>

  <p>
    {weather.weather[0].main === "Rain" ||
    weather.weather[0].main === "Drizzle" ||
    weather.weather[0].main === "Thunderstorm"
      ? "🌧️ Stay cozy indoors — try a movie, reading, or a creative hobby."
      : weather.main.temp >= 35
      ? "🥤 Very hot today — choose an indoor activity and stay hydrated."
      : weather.main.temp <= 15
      ? "🧥 Cool weather — try a cozy indoor activity or a short walk with warm layers."
      : weather.wind.speed > 8
      ? "💨 It's windy — a relaxed indoor activity may be more comfortable."
      : "🚶 Great conditions for a walk, outdoor photography, or a casual outing."}
  </p>
</div>

            {/* LOCATION */}
            <div className="location">
              <h2>
                {weather.name}, {weather.sys.country}
              </h2>

              <p>
                {weather.weather[0].description}
              </p>

              <span className="status-badge">
                🔴 LIVE WEATHER
              </span>

              {/* WEATHER MOOD */}
              <div className="weather-mood">
                {weather.main.temp >= 35
                  ? "🔥 It's a hot day! Stay hydrated."
                  : weather.main.temp >= 25
                  ? "☀️ A warm and pleasant day."
                  : weather.main.temp >= 18
                  ? "🌤️ Perfect weather to step outside."
                  : "🧥 It's quite cool. Keep yourself warm!"}
              </div>

              {/* DAY / NIGHT */}
              <div className="day-status">
                {isDay ? "🌞 Daytime" : "🌙 Nighttime"}
              </div>
            </div>

            {/* TEMPERATURE */}
            <div className="temperature">

              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={weather.weather[0].description}
              />

              <strong>
                {Math.round(weather.main.temp)}°C
              </strong>

            </div>

            {/* WEATHER DETAILS */}
            <div className="weather-details">

              <div className="detail">
                <span>🌡️</span>

                <p>Feels Like</p>

                <strong>
                  {Math.round(weather.main.feels_like)}°C
                </strong>
              </div>

              <div className="detail">
                <span>💧</span>

                <p>Humidity</p>

                <strong>
                  {weather.main.humidity}%
                </strong>
              </div>

              <div className="detail">
                <span>💨</span>

                <p>Wind</p>

                <strong>
                  {weather.wind.speed} m/s
                </strong>
              </div>

              <div className="detail">
                <span>🌡️</span>

                <p>Pressure</p>

                <strong>
                  {weather.main.pressure} hPa
                </strong>
              </div>

            </div>

            {/* WEATHER INSIGHTS */}
            <div className="weather-insights">

              <h3>
                🌤️ Weather Insights
              </h3>

              <div className="insight-list">

                {/* HUMIDITY */}
                <div className="insight">

                  <span>💧</span>

                  <div>
                    <strong>Humidity</strong>

                    <p>
                      {weather.main.humidity > 70
                        ? "Air feels humid"
                        : weather.main.humidity > 40
                        ? "Comfortable humidity"
                        : "Air feels dry"}
                    </p>
                  </div>

                </div>

                {/* WIND */}
                <div className="insight">

                  <span>💨</span>

                  <div>
                    <strong>Wind</strong>

                    <p>
                      {weather.wind.speed > 8
                        ? "Strong winds"
                        : weather.wind.speed > 4
                        ? "Moderate breeze"
                        : "Light breeze"}
                    </p>
                  </div>

                </div>

                {/* TEMPERATURE */}
                <div className="insight">

                  <span>🌡️</span>

                  <div>
                    <strong>Temperature</strong>

                    <p>
                      {weather.main.temp >= 35
                        ? "Very hot — stay hydrated"
                        : weather.main.temp >= 25
                        ? "Warm conditions"
                        : weather.main.temp >= 18
                        ? "Comfortable temperature"
                        : "Cool conditions"}
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </article>
        )}

      </section>
    </main>
  );
}

export default Weather;