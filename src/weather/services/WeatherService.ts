import { IWeatherResponseDTO } from '../interfaces/IWeatherResponseDTO'
import { APIClient } from '@/services/APIClient'

const WEATHER_POLLING_INTERVAL: number = 15 * 60 * 1000 // 15 minutes.

/**
 * Controller for the weather.
 */
export class WeatherService {
  private _cachedWeatherData: IWeatherResponseDTO | null = null
  
  constructor() {
    this.getWeather = this.getWeather.bind(this)

    this._startWeatherPolling()
  }

  /**
   * Get the weather data.
   * @returns IWeatherResponseDTO
   */
  public getWeather(): IWeatherResponseDTO | null {
    return this._cachedWeatherData
  }

  /**
   * Start the weather polling.
   */
  private _startWeatherPolling(): void {
    this._fetchWeatherData()

    setInterval(() => {
      this._fetchWeatherData()
    }, WEATHER_POLLING_INTERVAL)
  }

  /**
   * Fetch the weather data from the API.
   */
  private async _fetchWeatherData(): Promise<void> {
    try {
      const response = await APIClient.getWeather()
      this._cachedWeatherData = response.data
    } catch (error) {
      console.error(error)
    }
  }
}

let service: WeatherService

/**
 * Get the weather controller.
 * @returns WeatherController
 */
export const useWeatherService = (): WeatherService => {
  if (!service) {
    service = new WeatherService()
  }
  return service
}
