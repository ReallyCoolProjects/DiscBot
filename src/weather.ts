
import { API_ERROR } from './error';
import { WeatherInterface } from './interfaces';
import fetch from 'node-fetch';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// OpenWeatherMap API gives temp. in kelvin
function kelvinToCelsius(kelvin: number) {
	const fahrenheit = ((kelvin - 273.15) * 1.8) + 32;
	const celsius = (fahrenheit - 32) / 1.8;
	return Math.floor(celsius);
}

const getWeather = async(location: string) => {
	const key = process.env.API_KEY;
	try{
		const listRsp = await fetch(
			'https://api.openweathermap.org/data/2.5/weather?q=' + location + '&appid=' + key
		);
		const jsonFile: any = await listRsp.json();
		const dataToDisplay: WeatherInterface[] = [];
		dataToDisplay.push({
			//data to push
			main: jsonFile.main.name,
			temp: kelvinToCelsius(jsonFile.main.temp),
			feelsLike: kelvinToCelsius(jsonFile.main.feels_like),
			tempMin: kelvinToCelsius(jsonFile.main.temp_min),
			tempMax: kelvinToCelsius(jsonFile.main.temp_max),
			humidity: jsonFile.main.humidity,
			country: jsonFile.sys.country,
			name: jsonFile.name,
			weatherDescription: jsonFile.weather[0].description,
		});
		return dataToDisplay;
	} catch (error) {
		throw new API_ERROR('Unvalid Request');
	}
};

export {getWeather};
