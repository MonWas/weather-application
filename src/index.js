function formatDate(timestamp) {
  let date = new Date(timestamp);

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  let day = days[date.getDay()];
  return `${day}`;  
}

function formatHours(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${hours}:${minutes}`;
}

function displayWeatherCondition(response) {
  document.querySelector("#city").innerHTML = response.data.name;
  document.querySelector("#date").innerHTML = `Last updated: ${formatHours(response.data.dt * 1000)}`;
  document.querySelector("#description").innerHTML =
    response.data.weather[0].description;
  let weatherIcon = document.querySelector("#icon");
  weatherIcon.setAttribute("src", `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
  weatherIcon.setAttribute("alt", response.data.weather[0].description);
  celsiusTemperature = response.data.main.temp;
  document.querySelector("#temperature").innerHTML = Math.round(celsiusTemperature);

  document.querySelector("#sunrise").innerHTML = formatHours(response.data.sys.sunrise * 1000);
  document.querySelector("#sunset").innerHTML = formatHours(response.data.sys.sunset * 1000);
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed * 3.6);
  document.querySelector("#feels-like").innerHTML = Math.round(
    response.data.main.feels_like
  );
  document.querySelector("#pressure").innerHTML = response.data.main.pressure;
}

function displayTodaysWeather(response) {
  let todaysWeather = document.querySelector("#todays-weather");
  todaysWeather.innerHTML = null;
  let forecast = null;

  for (let i = 0; i < 6; i++) {
    forecast = response.data.list[i];
    todaysWeather.innerHTML += `
    <div class="col-2">
      <p>${formatHours(forecast.dt * 1000)}</p>
      <img src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png"/>
      <p><span class="today">${Math.round(forecast.main.temp)}</span>°</p>
    </div>
    `;
  }
  let apiKey = "48be2d76f648061999ec29f411aadf83";
  let latitude = response.data.city.coord.lat;
  let longitude = response.data.city.coord.lon;
  apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeeklyForecast);
}

function displayWeeklyForecast(response) {
  let weeklyForecast = document.querySelector("#weekly-forecast");
  weeklyForecast.innerHTML = null;
  let forecast = null;

  for (let i = 1; i < 7; i++) {
    forecast = response.data.daily[i];
    weeklyForecast.innerHTML += `
    <div class="col-3"><strong>${formatDate(forecast.dt * 1000)}</strong></div>
    <div class="col-3"><img src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png"/></div>
    <div class="col-3"><strong><span class="weekly">${Math.round(forecast.temp.day)}</span>°</strong></div>
    <div class="col-3"><p><span class="weekly">${Math.round(forecast.temp.night)}</span>°</p></div>
    `;
  }
  document.querySelector("#visibility").innerHTML = response.data.current.visibility / 1000;
  document.querySelector("#uvi").innerHTML = Math.round(response.data.current.uvi);
  document.querySelector("#cloudiness").innerHTML = response.data.current.clouds;
  document.querySelector("#dew-point").innerHTML = Math.round(response.data.current.dew_point);
}

function searchCity(city) {
  let apiKey = "48be2d76f648061999ec29f411aadf83";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeatherCondition);

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayTodaysWeather);
}

searchCity("Zurich");

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  searchCity(city);
}
let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSubmit);

function searchLocation(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = "48be2d76f648061999ec29f411aadf83";
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather";
  let apiUrl = `${apiEndpoint}?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
  axios.get(apiUrl).then(displayWeatherCondition);

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayTodaysWeather);

  apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeeklyForecast);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

let currentLocationButton = document.querySelector("#current-location-button");
currentLocationButton.addEventListener("click", getCurrentLocation);

function convertToFahrenheit(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  temperatureElement.innerHTML = Math.round((celsiusTemperature * 9) / 5 + 32);

  let today = document.querySelectorAll(".today");
  today.forEach(function (item) {
    let currentTemp = item.innerHTML;
    item.innerHTML = Math.round((currentTemp * 9) / 5 + 32);
  });

  let weekly = document.querySelectorAll(".weekly");
  weekly.forEach(function (item) {
    let currentTemp = item.innerHTML;
    item.innerHTML = Math.round((currentTemp * 9) / 5 + 32);
  });

  celsiusLink.addEventListener("click", displayCelsiusTemperature);
  fahrenheitLink.removeEventListener("click", displayFahrenheitTemperature);
}
let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", convertToFahrenheit);

function convertToCelsius(event) {
  event.preventDefault();
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);

  let today = document.querySelectorAll(".today");
  today.forEach(function (item) {
    let currentTemp = item.innerHTML;
    item.innerHTML = Math.round(((currentTemp - 32) * 5) / 9);
  });

  let weekly = document.querySelectorAll(".weekly");
  weekly.forEach(function (item) {
    let currentTemp = item.innerHTML;
    item.innerHTML = Math.round(((currentTemp - 32) * 5) / 9);
  });

  celsiusLink.removeEventListener("click", displayCelsiusTemperature);
  fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);
}
let celsiusTemperature = null;

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", convertToCelsius);