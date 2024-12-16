import { AxiosResponse } from 'axios'
import { RESTClient } from '@/services/RESTClient'
import { IWeatherResponseDTO } from '@/weather/interfaces/IWeatherResponseDTO'

/**
 * API service singleton.
 */
export class APIClient {
  
  /**
   * Get the current weather.
   * @returns The current weather.
   */
  public static getWeather(): Promise<AxiosResponse<IWeatherResponseDTO>> {
    return RESTClient.get<IWeatherResponseDTO>(`/v1/weather`)
  }
}
