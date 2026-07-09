const weatherCard = document.getElementById('weather-card');
const locationEl = document.getElementById('weather-location');
const iconEl = document.getElementById('weather-icon');
const tempEl = document.getElementById('weather-temp');
const descEl = document.getElementById('weather-description');
const metaEl = document.getElementById('weather-meta');

const conditionMap = {
  0: { emoji: '☀️', label: 'Clear sky' },
  1: { emoji: '🌤️', label: 'Mainly clear' },
  2: { emoji: '⛅', label: 'Partly cloudy' },
  3: { emoji: '☁️', label: 'Overcast' },
  45: { emoji: '🌫️', label: 'Fog' },
  48: { emoji: '🌫️', label: 'Depositing rime fog' },
  51: { emoji: '🌦️', label: 'Light drizzle' },
  53: { emoji: '🌦️', label: 'Moderate drizzle' },
  55: { emoji: '🌦️', label: 'Dense drizzle' },
  56: { emoji: '🌧️', label: 'Freezing drizzle' },
  57: { emoji: '🌧️', label: 'Heavy freezing drizzle' },
  61: { emoji: '🌧️', label: 'Light rain' },
  63: { emoji: '🌧️', label: 'Moderate rain' },
  65: { emoji: '🌧️', label: 'Heavy rain' },
  66: { emoji: '🌧️', label: 'Freezing rain' },
  67: { emoji: '🌧️', label: 'Heavy freezing rain' },
  71: { emoji: '🌨️', label: 'Light snow' },
  73: { emoji: '🌨️', label: 'Moderate snow' },
  75: { emoji: '🌨️', label: 'Heavy snow' },
  77: { emoji: '🌨️', label: 'Snow grains' },
  80: { emoji: '🌧️', label: 'Rain showers' },
  81: { emoji: '🌧️', label: 'Heavy rain showers' },
  82: { emoji: '⛈️', label: 'Violent rain showers' },
  85: { emoji: '❄️', label: 'Snow showers' },
  86: { emoji: '❄️', label: 'Heavy snow showers' },
  95: { emoji: '⛈️', label: 'Thunderstorm' },
  96: { emoji: '⛈️', label: 'Thunderstorm with hail' },
  99: { emoji: '⛈️', label: 'Severe thunderstorm with hail' },
};

function getCondition(code) {
  return conditionMap[code] || { emoji: '🌥️', label: 'Unknown conditions' };
}

function showError(message) {
  locationEl.textContent = 'Weather unavailable';
  iconEl.textContent = '⚠️';
  tempEl.textContent = '--°F';
  descEl.textContent = message;
  metaEl.textContent = 'Try again or allow location access.';
}

function updateWeather({ latitude, longitude }) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&temperature_unit=fahrenheit`;

  fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error('Weather fetch failed');
      return response.json();
    })
    .then((data) => {
      const weather = data.current_weather;
      if (!weather) throw new Error('No current weather data');

      const condition = getCondition(weather.weathercode);
      const temp = Math.round(weather.temperature);
      const direction = weather.winddirection;

      locationEl.textContent = 'Your location';
      iconEl.textContent = condition.emoji;
      tempEl.textContent = `${temp}°F`;
      descEl.textContent = condition.label;
      metaEl.textContent = `Wind ${direction}° · Updated just now`;
    })
    .catch((error) => {
      console.error(error);
      showError('Unable to load weather');
    });
}

if ('geolocation' in navigator) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      updateWeather({ latitude, longitude });
    },
    (error) => {
      console.warn(error);
      showError('Enable location to see the location.');
      metaEl.textContent = 'Allow location access to show local weather.';
    },
    { enableHighAccuracy: false, timeout: 10000 }
  );
} else {
  showError('Geolocation is not supported in this browser.');
}
