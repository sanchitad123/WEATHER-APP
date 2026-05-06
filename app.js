const cityInput = document.querySelector(".city-input");
const searchBtn = document.querySelector(".search-btn");

const weatherInfoSection = document.querySelector(".weather-info");
const notFoundSection = document.querySelector(".not-found");
const searchCitySection = document.querySelector(".search-city");

const countryTxt = document.querySelector(".country-txt");
const tempTxt = document.querySelector('.temp-txt');
const conditionTxt = document.querySelector('.condition-txt');
const humidityValueTxt = document.querySelector('.humidity-value-txt');
const windValueTxt = document.querySelector('.wind-value-txt');
const weatherSummaryImg = document.querySelector('.weather-summary-img');
const currentDateTxt = document.querySelector('.current-date-txt');

const forcastItemsContainer = document.querySelector('.forcast-items-container');

const API_KEY = '0de832d8d81d70a92d8480a951e5d82a';


searchBtn.addEventListener("click", () => {
    if(cityInput.ariaValueMax.trim() != ''){
        updateWeatherInfo(cityInput.value);
        cityInput.value = '';
        cityInput.blur();
    }
});


cityInput.addEventListener('keydown', (event) => {
    if(event.key == 'Enter' && cityInput.ariaValueMax != ''){
        updateWeatherInfo(cityInput.value);
        cityInput.value = '';
        cityInput.blur();
    }
});


async function getFetchData(endPoint, city){
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${API_KEY}&units=metric`;

    const response = await fetch(apiUrl);

    return response.json();
}

function getWeatherIcon(id){
    if(id <= 232){
        return 'thunderstorm.svg';
    }
    else if(id <= 321){
        return 'drizzle.svg';
    }
    else if(id <= 531){
        return 'rain.svg';
    }
    else if(id <= 622){
        return 'snow.svg';
    }
    else if(id <= 781){
        return 'atmosphere.svg';
    }
    else if(id <= 800){
        return 'clear.svg';
    }
    else{
        return 'clouds.svg';
    }
}

function getCurrentDate(){
    const currentDate = new Date();
    const options = {
        weekday: 'short',
        day: '2-digit',
        month: 'short'
    }

    return currentDate.toLocaleDateString('en-GB', options);
}

async function updateWeatherInfo(city){
    const weatherData = await getFetchData('weather', city);

    if(weatherData.cod != 200){
        showDisplaySection(notFoundSection);
        return;
    }

    const {
        name: country,
        main: { temp, humidity },
        weather : [{ id, main }],
        wind: { speed }
    } = weatherData

    countryTxt.textContent = country;
    tempTxt.textContent = Math.round(temp) + ' °C';
    conditionTxt.textContent = main;
    humidityValueTxt.textContent = humidity + '%';
    windValueTxt.textContent = speed + ' M/s';

    currentDateTxt.textContent = getCurrentDate();
    weatherSummaryImg.src = `assets/weather/${getWeatherIcon(id)}`;

    await updateForcastsInfo(city);
    showDisplaySection(weatherInfoSection);
}


async function updateForcastsInfo(city){
    const forcastData = await getFetchData('forecast', 'city');
    const timeTaken = '12:00:00';
    const todayDate = new Date().toISOString().split('T')[0];

    forcastItemsContainer.innerHTML = '';
    forcastData.list.forEach(forcastsWeather => {
        if(forcastsWeather.dt_txt.includes(timeTaken) && !forcastsWeather.dt_txt.includes(todayDate)){
            updateForecastItems(forcastsWeather);
        }
    });
};


function updateForecastItems(weatherData){
    const {
        dt_txt: date,
        weather: [{ id }],
        main: { temp }
    } = weatherData

    const dateTaken = new Date(date);
    const dateOption = {
        day:'2-digit',
        month: 'short'
    }

    const dateResult = dateTaken.toLocaleDateString('en-US', dateOption);

    const forecastItem = `
        <div class="forcast-item">
            <h5 class="forcast-item-date regular-txt">${dateResult}</h5>
            <img src="assets/weather/${getWeatherIcon(id)}" class="forcast-item-img">
            <h5 class="forcast-item-temp">${Math.round(temp)} °C</h5>
        </div>
    `

    forcastItemsContainer.insertAdjacentHTML('beforeend', forecastItem)
}


function showDisplaySection(section){
    [weatherInfoSection, searchCitySection, notFoundSection].forEach(section => section.style.display = 'none');

    section.style.display = 'flex';
}