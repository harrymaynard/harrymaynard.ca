export interface IWeatherResponseDTO{
  weather: {
    categories: Array<{
      code: number
      title: string
      description: string
    }>
    temperature: number
    feelsLike: number
    temperatureMin: number
    temperatureMax: number
    pressure: number
    humidity: number
    seaLevel: number
    visibility: number
    windSpeed: number
    windDegrees: number
    cloudCoverage: number
  },
  geo: {
    country: string
    city: string
    sunrise: number
    sunset: number
    timezone: number
  }
}
