<template>
  <div class="container">
    <div class="header">
      <h1>WEATHER APP</h1>
      <div class="search-bar">
        <input
          type="text"
          v-model="city"
          placeholder="Enter city name"
          class="search-input"
          @keyup.enter="searchByCity"
        />
        <button @click="searchByCity" class="search-button">Search</button>
      </div>
       <p v-if="error" class="error-message">{{ error }}</p>
    </div>
    <main>
      <div v-if="weatherData">
        <h2>{{ weatherData.name }}, {{ weatherData.sys.country }}</h2>
        <div>
          <img :src="iconUrl" alt="Weather Icon" />
          <p>{{ temperature }} °C</p>
        </div>
        <span>{{ weatherData.weather[0].description }}</span>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const apiKey = '3892e504e298f34d5c9288114822673f'
const city = ref('')
const weatherData = ref(null)
const error = ref(null)

const searchByCity = async () => {
  if (!city.value) return
  error.value = null
  weatherData.value = null
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&appid=${apiKey}`
  await fetchWeatherData(url)
}

const temperature = computed(() => {
  return weatherData.value ? Math.floor(weatherData.value.main.temp - 273) : null
})

const iconUrl = computed(() => {
  return weatherData.value
    ? `https://api.openweathermap.org/img/w/${weatherData.value.weather[0].icon}.png`
    : null
})

const fetchCurrentLocationWeather = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`
      await fetchWeatherData(url)
    },
    (geoError) => {
        error.value = "Could not get current location. Please search for a city."
        console.error("Geolocation error:", geoError)
    }
    )
  } else {
      error.value = "Geolocation is not supported by this browser."
  }
}

const fetchWeatherData = async (url) => {
  try {
    const response = await axios.get(url)
    weatherData.value = response.data
    error.value = null
  } catch (err) {
    console.error('Error fetching weather data:', err)
    if (err.response) {
        if(err.response.status === 401) {
            error.value = "Invalid API Key. Please check your API key in the code."
        } else if (err.response.status === 404) {
            error.value = `Could not find weather data for "${city.value}". Please check the city name.`
        } else {
            error.value = "An error occurred while fetching weather data."
        }
    } else {
        error.value = "A network error occurred. Please check your connection."
    }
    weatherData.value = null
  }
}

onMounted(() => {
  fetchCurrentLocationWeather()
})
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  text-align: center;
}
.header {
  margin-bottom: 20px;
}
.search-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 10px;
}
.search-input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-right: 10px;
  flex-grow: 1;
  max-width: 300px;
}
.search-button {
  padding: 10px 20px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  cursor: pointer;
}
.search-button:hover {
  background-color: #0056b3;
}
main {
  margin-top: 20px;
}
.error-message {
    color: red;
    margin-top: 10px;
}
</style>

