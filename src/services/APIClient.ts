import { AxiosResponse } from 'axios'
import { RESTClient } from '@/services/RESTClient'
import { IWeatherResponseDTO } from '@/weather/interfaces/IWeatherResponseDTO'
import { IMailRequestDto } from '@/interfaces/IMailRequestDto'
import { IMailResponseDto } from '@/interfaces/IMailResponseDto'

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

  public static postMail(
    data: IMailRequestDto
  ): Promise<AxiosResponse<IMailResponseDto>> {
    return RESTClient.post<IMailResponseDto>(`/v1/contact`, data)
  }
}
