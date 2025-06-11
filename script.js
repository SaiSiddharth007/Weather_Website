// script.js
const apiKey = "a5dcc3567fa83c13e60ffd2e96fb6d40"; // Your OpenWeatherMap API key
let isCelsius = true;

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const geoBtn = document.getElementById("geoBtn");
const weatherCard = document.getElementById("weatherCard");
const loading = document.getElementById("loading");
const errorMsg = document.getElementById("errorMsg");
const unitToggle = document.getElementById("unit-toggle");
const modeToggle = document.getElementById("mode-toggle");

function displayWeather(data) {
  const { name, sys, main, weather, wind } = data;
  document.getElementById("location").textContent = `${name}, ${sys.country}`;
  document.getElementById("temperature").textContent = isCelsius
    ? `${Math.round(main.temp)}°C`
    : `${Math.round((main.temp * 9) / 5 + 32)}°F`;
  document.getElementById("description").textContent = weather[0].description;
  document.getElementById("icon").src = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
  document.getElementById("humidity").textContent = `${main.humidity}%`;
  document.getElementById("wind").textContent = `${wind.speed} m/s`;
  document.getElementById("pressure").textContent = `${main.pressure} hPa`;
  weatherCard.classList.remove("hidden");
}

async function getWeather(city) {
  loading.classList.remove("hidden");
  weatherCard.classList.add("hidden");
  errorMsg.classList.add("hidden");
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    const data = await res.json();
    if (data.cod !== 200) throw new Error();
    displayWeather(data);
  } catch (err) {
    errorMsg.classList.remove("hidden");
  } finally {
    loading.classList.add("hidden");
  }
}

function getLocationWeather() {
  if (!navigator.geolocation) return alert("Geolocation not supported");
  navigator.geolocation.getCurrentPosition(async position => {
    const { latitude, longitude } = position.coords;
    loading.classList.remove("hidden");
    weatherCard.classList.add("hidden");
    errorMsg.classList.add("hidden");
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
      );
      const data = await res.json();
      if (data.cod !== 200) throw new Error();
      displayWeather(data);
    } catch {
      errorMsg.classList.remove("hidden");
    } finally {
      loading.classList.add("hidden");
    }
  });
}

searchBtn.addEventListener("click", () => {
  if (cityInput.value) getWeather(cityInput.value);
});
geoBtn.addEventListener("click", getLocationWeather);
unitToggle.addEventListener("click", () => {
  isCelsius = !isCelsius;
  if (!weatherCard.classList.contains("hidden")) {
    const temp = document.getElementById("temperature").textContent;
    const number = parseFloat(temp);
    document.getElementById("temperature").textContent = isCelsius
      ? `${Math.round((number - 32) * 5 / 9)}°C`
      : `${Math.round((number * 9) / 5 + 32)}°F`;
  }
});
modeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});
