import { type AxiosResponse } from 'axios'
import { IWeatherResponseDTO } from '../interfaces/IWeatherResponseDTO'
import { APIClient } from '@/services/APIClient'
import { WeatherFactory } from '@/weather/factories/WeatherFactory'

const WEATHER_POLLING_INTERVAL: number = 60 * 60 * 1000 // 1 hour

/**
 * Controller for the weather.
 */
export class WeatherService {
  private _cachedWeatherData: IWeatherResponseDTO | null = null
  private _weatherRequestPromise: Promise<AxiosResponse<IWeatherResponseDTO>> | null = null

  constructor() {
    this.getWeather = this.getWeather.bind(this)

    this._startWeatherPolling()
  }

  /**
   * Get the weather data.
   * @returns Promise<IWeatherResponseDTO>
   */
  public async getWeather(): Promise<IWeatherResponseDTO> {
    let weather: IWeatherResponseDTO | undefined = undefined

    if (this._cachedWeatherData) {
      weather = this._cachedWeatherData
    } else {
      try {
        if (!this._weatherRequestPromise) {
          this._weatherRequestPromise = APIClient.getWeather()
            .finally(() => {
              this._weatherRequestPromise = null
            })
        }
        const { data } = await this._weatherRequestPromise
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

  private _startWeatherPolling(): void {
    this.getWeather()

    setInterval(() => {
      // Clear the cached weather data.
      this._cachedWeatherData = null
      console.log('Weather data cache cleared.')
    }, WEATHER_POLLING_INTERVAL)
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
