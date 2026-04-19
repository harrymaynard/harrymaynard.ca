const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'

export interface IRESTResponse<T> {
  data: T
}

/**
 * REST client singleton.
 */
export class RESTClient {

  /**
   * Perform a GET request.
   * @param url The URL. Must begin with a forward slash.
   * @returns The response.
   */
  public static async get<T>(url: string): Promise<IRESTResponse<T>> {
    const response = await fetch(`${API_BASE_URL}${url}`)
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`)
    }

    return {
      data: await response.json() as T,
    }
  }
}
