import { IWeatherResponseDTO } from '../interfaces/IWeatherResponseDTO'
import { WeatherFactory } from '../factories/WeatherFactory'

/**
 * Controller for the weather.
 */
export class WeatherService {
  private _localStorageWeather: IWeatherResponseDTO | null = null

  constructor() {
    this._localStorageWeather = this._getLocalStorageWeather()
  }

  /**
   * Get the weather data.
   * @returns IWeatherResponseDTO | null
   */
  public async getWeather(): Promise<IWeatherResponseDTO | null> {
    let weather: IWeatherResponseDTO | null = null

    if (this._localStorageWeather) {
      weather = this._localStorageWeather
    } else {
      weather = WeatherFactory.createMockWeather()
    }
    // TODO: Fetch the weather data from the API.
    
    return Promise.resolve(weather)
  }

  /**
   * Load the weather data from local storage.
   * @returns IWeatherResponseDTO | null
   */
  private _getLocalStorageWeather(): IWeatherResponseDTO | null {
    const weatherJSON = localStorage.getItem('weather')
    let weather: IWeatherResponseDTO | null = null

    if (weatherJSON) {
      try {
        weather = JSON.parse(weatherJSON)
        console.log('Weather data loaded from local storage:', weather)
      } catch (error) {
        console.error('Error parsing weather data from local storage:', error)
      }
    }
    return weather
  }
}

let weatherService: WeatherService

/**
 * Get the weather controller.
 * @returns WeatherController
 */
export const useWeatherService = () => {
  if (!weatherService) {
    weatherService = new WeatherService()
  }
  return weatherService
}
