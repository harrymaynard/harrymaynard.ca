import axios, { type AxiosResponse } from 'axios'

const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'

/**
 * REST client singleton.
 */
export class RESTClient {

  /**
   * Perform a GET request.
   * @param url The URL. Must begin with a forward slash.
   * @returns The response.
   */
  public static get<T>(url: string): Promise<AxiosResponse<T>> {
    return axios.get<T>(`${API_BASE_URL}${url}`)
  }
}
