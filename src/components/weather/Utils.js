import {
  clear,
  clouds,
  cloudNight,
  mist,
  night,
  rain,
  snow,
  thunderstorm,
} from "../../img/";

//OpenWeatherMap Geo API to convert the city name into latitude and longitude values.
export async function getLocation(cityName, setLocation) {
  try {
    const response = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${process.env.REACT_APP_API_KEY}`
    );
    const data = await response.json();

    if (data.length > 0) {
      const { lat, lon } = data[0];
      setLocation({ lat, lon });
    } else {
      console.warn("City not found");
      setLocation(null);
    }
  } catch (error) {
    console.error("Error fetching location data:", error);
    setLocation(null);
  }
}

//Geolocation API to fetch the user's latitude and longitude values
export function getUserLocation(setLocation) {
  const handleLocationSuccess = (position) => {
    const { latitude, longitude } = position.coords;
    setLocation({ lat: latitude, lon: longitude });
  };

  const handleLocationError = (error) => {
    console.warn(
      "Location access denied, setting default to Cebu City.",
      error
    );
    setLocation({ lat: 10.3157, lon: 123.8854 }); // Cebu City's lat and lon
  };

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      handleLocationSuccess,
      handleLocationError
    );
  } else {
    console.warn(
      "Geolocation is not supported by this browser, setting default to Cebu City."
    );
    setLocation({ lat: 10.3157, lon: 123.8854 }); // Cebu City's lat and lon
  }
}

export async function fetchWeatherData(
  location,
  setWeatherData,
  setErrorMessage
) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&units=metric&appid=${process.env.REACT_APP_API_KEY}`
    );
    const data = await response.json();

    if (data.cod === "404") {
      setErrorMessage(data.message);
      return null;
    } else {
      setWeatherData(data);
      setErrorMessage("");
      return data;
    }
  } catch (error) {
    console.log(error);
    setErrorMessage("An unexpected error occurred. Please try again later.");
    return null;
  }
}

//   Weather forecast fetch
export async function fetchWeatherForecastData(
  location,
  setWeatherForecast,
  setErrorMessage
) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lon}&units=metric&cnt=4&appid=${process.env.REACT_APP_API_KEY}`
    );
    const data = await response.json();
    if (data.cod === "404") {
      setErrorMessage(data.message);
    } else {
      setWeatherForecast(data);
      setErrorMessage("");
    }
  } catch (error) {
    console.log(error);
    setErrorMessage("An unexpected error occurred. Please try again later.");
  }
}

export function getCurrentDate(weatherData) {
  let unix_timestamp = weatherData?.dt;
  let timezone_offset = weatherData?.timezone;

  // Convert timezone offset from seconds to milliseconds
  let local_time = new Date((unix_timestamp + timezone_offset) * 1000);

  // Extract parts of the date
  const [day, date, month, year] = local_time.toUTCString().split(" ");
  const hour = local_time.getUTCHours();
  const minute = local_time.getUTCMinutes();

  // Calculate GMT offset
  const localGMT = timezone_offset / 3600;
  const gmtString = `GMT${localGMT >= 0 ? "+" : ""}${localGMT}`;

  // Format the output
  return `${day} ${date} ${month} ${year} ${hour}:${minute} ${gmtString}`;
}

export function getWeatherBg(icon) {
  switch (icon) {
    case "01d":
      return clear;
    case "01n":
      return night;
    case "02d":
    case "03d":
    case "04d":
      return clouds;
    case "02n":
    case "03n":
    case "04n":
      return cloudNight;
    case "09d":
    case "09n":
    case "10d":
    case "10n":
      return rain;
    case "11d":
    case "11n":
      return thunderstorm;
    case "13d":
    case "13n":
      return snow;
    case "50d":
    case "50n":
      return mist;
    default:
      return clear; // Fallback image
  }
}
