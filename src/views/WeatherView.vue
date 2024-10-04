<template>
  <!-- 🗄️ W10. weather check -->
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-8 offset-md-2">
          <h1 class="text-center">🗄️ Weather App </h1>
          <p class="text-center">
              Check weather
          </p>

          <div class="input-group mb-3">
            <input
              type="text"
              class="form-control"
              placeholder="Enter city name"
              v-model="city"
            />
            <button type="button" class="btn btn-secondary" @click="fetchWeatherByCity">Search</button>
          </div>

          
          <main v-if="weatherData" class="text-center">
              <h2>
                  {{ weatherData.name }}, {{ weatherData.sys.country }}
              </h2>
              <div>
                  <img :src="iconUrl" alt="Weather Icon" />
                  <p>{{ temperature }} °C</p>
              </div>
              <span>{{ weatherData.weather[0].description }}</span>
          </main>
      </div>
    </div>
  </div>
</template>


<script>
import axios from "axios";

const apikey = "5ac4737ea0f37d2d8512a5ebe0f74b3f"; 

export default {
  name: "WeatherApp",
  data() {
    return {
      city: "",
      weatherData: null,
      hourlyForecast: [],
      dailyForecast: [],
    };
  },
  computed: {
    temperature() {
      return this.weatherData
        ? Math.floor(this.weatherData.main.temp - 273.15)
        : null;
    },
    iconUrl() {
      return this.weatherData
        ? `http://openweathermap.org/img/wn/${this.weatherData.weather[0].icon}@2x.png`
        : null;
    },
  },
  mounted() {
    this.fetchCurrentLocationWeather();
  },
  methods: {
    async fetchCurrentLocationWeather() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          const url = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apikey}`;
          await this.fetchWeatherData(url);
        });
      }
    },
    async fetchWeatherByCity() {
      if (this.city.trim() !== "") {
        const url = `http://api.openweathermap.org/data/2.5/weather?q=${this.city}&appid=${apikey}`;
        await this.fetchWeatherData(url);
      } else {
        alert("Please enter a city name.");
      }
    },
    async fetchWeatherData(url) {
      try {
        const response = await axios.get(url);
        this.weatherData = response.data;
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    }
  },
};
</script>
