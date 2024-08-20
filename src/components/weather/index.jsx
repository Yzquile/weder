import { useEffect, useState } from "react";
import Search from "../search";
import {
  fetchWeatherData,
  fetchWeatherForecastData,
  getCurrentDate,
  getWeatherBg,
  getUserLocation,
  getLocation,
} from "./Utils";

export default function Weather() {
  const [search, setSearch] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [weatherForecast, setWeatherForecast] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [location, setLocation] = useState(null);
  const [inputError, setInputError] = useState("");


  // Handle search function
  function handleSearch() {
    if (search.trim() === "") {
      setInputError("Please input a location");
    } else {
      setInputError("");
      getLocation(search, (location) => {
        setLocation(location);
        if (location) {
          fetchWeatherData(location, setWeatherData, setErrorMessage);
          fetchWeatherForecastData(
            location,
            setWeatherForecast,
            setErrorMessage
          );
        } else {
          setErrorMessage("City not found");
        }
      });
    }
  }

  //Get user location on first load or default to Cebu City if user declined
  useEffect(() => {
    getUserLocation(setLocation);
  }, []);

  // Fetch weather data on location change
  useEffect(() => {
    if (location) {
      fetchWeatherData(location, setWeatherData, setErrorMessage);
      fetchWeatherForecastData(location, setWeatherForecast, setErrorMessage);
    }
  }, [location]);

  //Getting forecast_date for Weather forecast
  const forecast_date = weatherForecast?.list[0]?.dt_txt?.split(" ")[0];
  const icon = weatherData?.weather[0]?.icon
    ? `/icons/${weatherData.weather[0].icon}.svg`
    : "";

  //background image function
  //if weather[0].icon == 10d it is rainy day, if it is 10n it is rainy night
  const bgImage = weatherData?.weather[0]?.icon
    ? getWeatherBg(weatherData.weather[0].icon)
    : getWeatherBg("01d");

  return (
    <div
      className="min-h-screen w-screen"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
      }}
    >
      <Search
        search={search}
        setSearch={setSearch}
        handleSearch={handleSearch}
        inputError={inputError}
      />
      {/* Location info */}
      <div className="Weather h-60 flex flex-col justify-center items-center text-center">
        {errorMessage ? (
          <div>
            <h1 className="text-6xl font-bold text-white font-serif">
              City not found
            </h1>
          </div>
        ) : weatherData ? (
          <>
            <div className="flex max-w-96 w-full justify-around items-center">
              <p>Feels like {weatherData.main.feels_like} &deg;</p>
              <span>
                <img
                  src={icon}
                  alt="icon"
                  className="size-auto font-semibold"
                />
              </span>
            </div>
            <h1 className="text-6xl font-bold text-white font-serif">
              {weatherData.name}, {weatherData.sys.country}
            </h1>
            <small className="mt-2 font-semibold tracking-wide text-sm">
              {getCurrentDate(weatherData)}
            </small>
          </>
        ) : (
          <div>
            <h2>Try searching a city</h2>
          </div>
        )}
      </div>
      {/* Weather details and Forecast */}
      <div className="container flex w-screen flex-wrap text-center justify-around sm:flex-row">
        <div className="w-10/12 h-auto mb-4 lg:w-2/5 rounded-3xl bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-100">
          <h2 className="mt-3 text-xl font-bold">Weather Details</h2>

          {errorMessage ? null : weatherData ? (
            <div className="flex flex-col justify-center w-11/12">
              <div className="p-4 flex align-center justify-between">
                <p>Temp max</p>
                <p>{weatherData?.main?.temp_max} &deg;C</p>
              </div>
              <div className="p-4 flex align-center justify-between">
                <p>Temp min</p>
                <p>{weatherData?.main?.temp_min} &deg;C</p>
              </div>
              <div className="p-4 flex align-center justify-between">
                <p>Humidity</p>
                <p>{weatherData?.main?.humidity}%</p>
              </div>
              <div className="p-4 flex align-center justify-between">
                <p>Wind Speed</p>
                <p>
                  {((weatherData?.wind?.speed * 3600) / 1000).toFixed(1)} km/h
                </p>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>

        <div className="container w-10/12 h-auto mb-4 lg:w-2/5 rounded-3xl bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-100">
          <h2 className="mt-3 text-xl font-bold">Weather Forecast</h2>
          <p className="flex justify-center mb-4">{forecast_date}</p>
          <div className="flex justify-around w-11/12 m-auto relative">
            {errorMessage
              ? null
              : weatherForecast?.list.map((item) => (
                  <div key={item.dt_txt}>
                    <p className="mx-2">
                      {item.dt_txt.split(" ")[1].slice(0, 5)}
                    </p>
                    <p>{item.weather[0].main}</p>
                    <img
                      src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                      alt="icon"
                      className="m-auto"
                    />
                    <small className="capitalize flex mb-4 mx-2">
                      {item.weather[0].description}
                    </small>
                  </div>
                ))}
          </div>
        </div>
      </div>{" "}
      {/* end of details and forecast */}
    </div>
  );
}
