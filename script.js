const apiKey = "6b3639fec8e662900bd09068ee94b53c"

const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const loading = document.getElementById("loading");
const error = document.getElementById("error");
const weatherCard = document.getElementById("weatherCard");
const cityName = document.getElementById("cityName");
const description = document.getElementById("description");
const temp = document.getElementById("temp");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const forecast = document.getElementById("forecast");
const forecastTitle = document.getElementById("forecastTitle");

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city !== "") {
    fetchWeather(city);
  }
});

async function fetchWeather(city) {
  loading.classList.remove("hidden");
  error.classList.add("hidden");
  weatherCard.classList.add("hidden");
  forecast.classList.add("hidden");
  forecastTitle.classList.add("hidden");

  try {
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    const weatherData = await weatherRes.json();

    if (weatherData.cod !== 200) {
      throw new Error(weatherData.message);
    }

    cityName.textContent = weatherData.name;
    description.textContent = weatherData.weather[0].description;
    temp.textContent = Math.round(weatherData.main.temp);
    humidity.textContent = weatherData.main.humidity;
    wind.textContent = weatherData.wind.speed;
    weatherCard.classList.remove("hidden");

    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
    );
    const forecastData = await forecastRes.json();

    displayForecast(forecastData.list);
  } catch (err) {
    error.textContent = `Error: ${err.message}`;
    error.classList.remove("hidden");
  } finally {
    loading.classList.add("hidden");
  }
}

function displayForecast(data) {
  const dailyData = data.filter((item) => item.dt_txt.includes("12:00:00"));
  forecast.innerHTML = "";
  dailyData.slice(0, 5).forEach((day) => {
    const date = new Date(day.dt_txt).toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

    const icon = day.weather[0].icon;
    const temp = Math.round(day.main.temp);

    forecast.innerHTML += `
      <div class="forecast-day">
        <div>${date}</div>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="">
        <div>${temp}°C</div>
      </div>
    `;
  });
  forecast.classList.remove("hidden");
  forecastTitle.classList.remove("hidden");
}
