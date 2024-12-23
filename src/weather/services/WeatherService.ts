import isEqual from 'lodash/isEqual'
import { IWeatherResponseDTO } from '../interfaces/IWeatherResponseDTO'
import { APIClient } from '@/services/APIClient'

const WEATHER_POLLING_INTERVAL: number = 15 * 60 * 1000 // 15 minutes.

export enum WeatherServiceEventType {
  Updated = 'updated',
}

/**
 * Controller for the weather.
 */
export class WeatherService extends EventTarget {
  private _cachedWeatherData: IWeatherResponseDTO | null = null
  
  constructor() {
    super()

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
      if (isEqual(response.data, this._cachedWeatherData)) {
        return
      }
      this._cachedWeatherData = response.data
      this.dispatchEvent(new Event(WeatherServiceEventType.Updated))
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
