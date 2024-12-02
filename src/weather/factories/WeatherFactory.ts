import { WeatherCodeType } from '../enums/WeatherCodeType'

export class WeatherFactory {
  /**
   * Get the weather code type from the given code.
   * List of codes found at: https://openweathermap.org/weather-conditions
   * @param code 
   * @returns WeatherCodeType
   */
  public static createWeatherCodeType(code: number): WeatherCodeType {
    switch (code) {
      // Thunderstorm.
      case 200:
      case 201:
      case 202:
      case 210:
      case 211:
      case 212:
      case 221:
      case 230:
      case 231:
      case 232:
        return WeatherCodeType.Thunderstorm
      // Drizzle.
      case 300:
      case 301:
      case 302:
      case 310:
      case 311:
      case 312:
      case 313:
      case 314:
      case 321:
        return WeatherCodeType.Drizzle
      // Rain.
      case 500:
      case 501:
      case 502:
      case 503:
      case 504:
      case 511:
      case 520:
      case 521:
      case 522:
      case 531:
        return WeatherCodeType.Rain
      // Snow.
      case 600:
      case 601:
      case 602:
      case 611:
      case 612:
      case 613:
      case 615:
      case 616:
      case 620:
      case 621:
      case 622:
        return WeatherCodeType.Snow
      // Atmosphere.
      case 701:
        return WeatherCodeType.Mist
      case 711:
        return WeatherCodeType.Smoke
      case 721:
        return WeatherCodeType.Haze
      case 731:
      case 761:
        return WeatherCodeType.Dust
      case 741:
        return WeatherCodeType.Fog
      case 751:
        return WeatherCodeType.Sand
      case 762:
        return WeatherCodeType.Ash
      case 771:
        return WeatherCodeType.Squall
      case 781:
        return WeatherCodeType.Tornado
      // Clear.
      case 800:
        return WeatherCodeType.Clear
      // Clouds.
      case 801:
      case 802:
      case 803:
      case 804:
        return WeatherCodeType.Clouds
      // Everything else.
      default:
        return WeatherCodeType.Unknown
    }
  }
}
