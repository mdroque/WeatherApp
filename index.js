const weatherApp = {
    // DOM Elements
    container: document.querySelector('.container'),
    search: document.querySelector('.search-box button'),
    weatherBox: document.querySelector('.weather-box'),
    weatherDetails: document.querySelector('.weather-details'),
    error404: document.querySelector('.not-found'),
    forecastContainer: document.querySelector('.container3 .forecast'),

    // Add container2 initialization
    container2: document.getElementById('container2'),

    // API Key
    APIKey: '381f3c690d4600f1ce738449db2526d0',

    // Event Listeners
    init: function () {
        this.search.addEventListener('click', this.handleSearch.bind(this));

        // Add this line to initialize container2
        this.container2 = document.getElementById('container2');
    },

    // Functions
    fetchWeatherData: async function (city) {
        const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${this.APIKey}`);
        const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&cnt=5&units=imperial&appid=${this.APIKey}`);
        const weatherData = await weatherResponse.json();
        const forecastData = await forecastResponse.json();
        return { weatherData, forecastData };
    },

    fetchDateTime: async function (city) {
        const apiKey = '381f3c690d4600f1ce738449db2526d0'; // Replace with your OpenWeather API key
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data && data.timezone) {
                const timestamp = (data.dt + data.timezone) * 1000;
                const dateTime = new Date(timestamp);
                return dateTime;
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            return null;
        }
    },

    updateDateTime: function (city, dateTime) {
        const options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        const formattedDateTime = dateTime.toLocaleString('en-US', options);

        // Use this.container2 instead of document.getElementById('container2')
        this.container2.innerHTML = `<p>${formattedDateTime}</p>`;
    },

    handleCityNotFound: function () {
        this.container.style.height = '400px';
        this.weatherBox.style.display = 'none';
        this.weatherDetails.style.display = 'none';
        this.error404.style.display = 'block';
        this.error404.classList.add('fadeIn');
    },

    handleWeatherData: function (data) {
        if (data.cod === '404') {
            this.handleCityNotFound();
            return;
        }

        // Hide the 404 error message
        this.error404.style.display = 'none';
        this.error404.classList.remove('fadeIn');

        // Select elements
        const image = this.weatherBox.querySelector('img');
        const temperature = this.weatherBox.querySelector('.temperature');
        const description = this.weatherBox.querySelector('.description');
        const humidity = this.weatherDetails.querySelector('.humidity span');
        const wind = this.weatherDetails.querySelector('.wind span');

        // Update image based on weather condition
        switch (data.weather[0].main) {
            case 'Clear':
                image.src = 'images/clear.png';
                break;
            case 'Rain':
                
            
                break;
            case 'Snow':
                image.src = 'images/snow.png';
                break;
            case 'Snowing':
                image.src = 'images/snowing.png';
                break;
            case 'Clouds':
                image.src = 'images/cloud.png';
                break;
            case 'Haze':
                image.src = 'images/mist.png';
                break;
            case 'Thunder':
                image.src = 'images/thunder.png';
                break;
            case 'Mist':
                image.src = 'images/66.png';
                break;
            default:
                image.src = '';
        }

        // Update other weather information
        temperature.innerHTML = `${parseInt(data.main.temp)}<span>°F</span>`;
        description.innerHTML = `${data.weather[0].description}`;
        humidity.innerHTML = `${data.main.humidity}%`;
        wind.innerHTML = `${parseInt(data.wind.speed)}Mp/h`;

        // Show weather information
        this.weatherBox.style.display = '';
        this.weatherDetails.style.display = '';
        this.weatherBox.classList.add('fadeIn');
        this.weatherDetails.classList.add('fadeIn');
        this.container.style.height = '590px';
    },

    displayForecast: function (forecastData) {
        this.forecastContainer.innerHTML = '';

        forecastData.list.forEach(entry => {
            const forecastItem = document.createElement('div');
            const dateTime = new Date(entry.dt_txt);
            const formattedDateTime = `${dateTime.toLocaleDateString()} ${dateTime.toLocaleTimeString()}`;
            forecastItem.textContent = `${formattedDateTime}: ${entry.main.temp} °F`;
            this.forecastContainer.appendChild(forecastItem);
        });

        document.querySelector('.container3').classList.add('show');
        document.querySelector('.container2').classList.add('show');
    },

    handleSearch: async function () {
        const city = this.search.parentElement.querySelector('input').value;

        if (city === '') return;

        try {
            const { weatherData, forecastData } = await this.fetchWeatherData(city);

            if (weatherData.cod === '404') {
                this.handleCityNotFound();
                return;
            }

            const dateTime = await this.fetchDateTime(city);
            this.updateDateTime(city, dateTime);
            this.handleWeatherData(weatherData);
            this.displayForecast(forecastData);
        } catch (error) {
            console.error('Error fetching data:', error);
            this.handleCityNotFound();
        }
    },

    // ... (other properties and methods)
};

// Initialize the application
weatherApp.init();
