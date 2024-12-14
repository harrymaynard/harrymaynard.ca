import { IWeatherResponseDTO } from '../interfaces/IWeatherResponseDTO'
import { APIClient } from '@/services/APIClient'
import { WeatherFactory } from '@/weather/factories/WeatherFactory'

/**
 * Controller for the weather.
 */
export class WeatherService {
  private _cachedWeatherData: IWeatherResponseDTO | null = null

  /**
   * Get the weather data.
   * @returns IWeatherResponseDTO | null
   */
  public async getWeather(): Promise<IWeatherResponseDTO> {
    let weather: IWeatherResponseDTO | undefined = undefined

    if (this._cachedWeatherData) {
      weather = this._cachedWeatherData
    } else {
      try {
        const { data } = await APIClient.getWeather()
        weather = this._cachedWeatherData = data
      } catch (error) {
        console.error(error)
      }
    }
    if (!weather) {
      weather = WeatherFactory.createMockWeather()
    }
    
    return Promise.resolve(weather)
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
