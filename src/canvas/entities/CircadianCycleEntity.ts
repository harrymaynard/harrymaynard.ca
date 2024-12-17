import { AbstractEntity } from '@/canvas/entities/AbstractEntity'
import { MoonEntity } from '@/canvas/entities/MoonEntity'
import { SunEntity } from '@/canvas/entities/SunEntity'
import { IWeatherResponseDTO } from '@/weather/interfaces/IWeatherResponseDTO'
import { useWeatherService, WeatherService } from '@/weather/services/WeatherService'

const PLANET_SIZE: number = 100
const SINGLE_DAY_DURATION: number = 24 * 60 * 60 * 1000

enum CircadianCycleType {
  Day = 'day',
  Night = 'night',
}

/**
 * Circadian cycle entity, which renders sun, moon, and sky.
 */
export class CircadianCycleEntity extends AbstractEntity {
  private _circadianCycleType: CircadianCycleType = CircadianCycleType.Day
  private _planetEntity: AbstractEntity | null = null
  private _weatherService: WeatherService = useWeatherService()
  private _cachedWeatherData: IWeatherResponseDTO | null = null

  constructor(params) {
    super(params)

    this._updatePlanetEntity()
  }

  private _updatePlanetEntity(): void {
    const weather = this._weatherService.getWeather()
    if (weather) {
      this._cachedWeatherData = weather
    }

    const sunriseTime: number = (this._cachedWeatherData?.geo.sunrise || 0) * 1000
    const sunsetTime: number = (this._cachedWeatherData?.geo.sunset || 0) * 1000
    const currentTime: number = Date.now()

    if (!sunriseTime || !sunsetTime) return

    const circadianCycleType: CircadianCycleType
      = currentTime >= sunriseTime && currentTime <= sunsetTime
        ? CircadianCycleType.Day
        : CircadianCycleType.Night

    if (
      circadianCycleType !== this._circadianCycleType ||
      !this._planetEntity
    ) {
      this._circadianCycleType = circadianCycleType
      
      if (this._planetEntity) {
        this.removeChild(this._planetEntity)
      }

      // Day time.
      if (this._circadianCycleType === CircadianCycleType.Day) {
        const x: number = (this.viewport.width / 2) - (PLANET_SIZE / 2)
        const y: number = this._getPlanetYPosition(
          this._circadianCycleType,
          sunriseTime,
          sunsetTime
        )
  
        this._planetEntity = new SunEntity({
          context: this.context,
          position: {
            x,
            y,
            width: PLANET_SIZE,
            height: PLANET_SIZE,
          },
        })
      }
      // Night time.
      else {
        const x: number = (this.viewport.width / 2) - (PLANET_SIZE / 2)
        const y: number = this._getPlanetYPosition(
          this._circadianCycleType,
          sunriseTime,
          sunsetTime
        )
        
        this._planetEntity = new MoonEntity({
          context: this.context,
          position: {
            x,
            y,
            width: PLANET_SIZE,
            height: PLANET_SIZE,
          },
        })
      }
      this.addChild(this._planetEntity)
    } else if (this._planetEntity) {
      const y: number = this._getPlanetYPosition(
        this._circadianCycleType,
        sunriseTime,
        sunsetTime
      )
      this._planetEntity.setY(y)
    }
  }

  public update(): void {
    super.update()
    
    this._updatePlanetEntity()
  }
  
  /**
   * Draw the sky background.
   */
  public draw(): void {
    if (this._circadianCycleType === CircadianCycleType.Night) {
      // Draw the night sky.
      this.context.fillStyle = 'rgba(0, 0, 0, 0.5)'
      this.context.fillRect(
        this.position.x,
        this.position.y,
        this.position.width,
        this.position.height
      )
    }
  }

  private _getPlanetYPosition(
    circadianCycleType: CircadianCycleType,
    sunriseTime: number,
    sunsetTime: number
  ): number {
    let planetDisplayDuration: number = 1

    switch (circadianCycleType) {
      case CircadianCycleType.Day:
        planetDisplayDuration = sunsetTime - sunriseTime
        return (1 - Math.sin(
          (Math.PI * (Date.now() - sunriseTime)) / planetDisplayDuration 
        )) * this.position.height

      case CircadianCycleType.Night:
        planetDisplayDuration = Math.abs(sunsetTime - sunriseTime - SINGLE_DAY_DURATION)
        return (1 - Math.sin(
          (Math.PI * (Date.now() - sunsetTime)) / planetDisplayDuration
        )) * this.position.height

      default:
        return 0
    }
  }
}
