import { AbstractEntity } from '@/canvas/entities/AbstractEntity'
import { MoonEntity } from '@/canvas/entities/MoonEntity'
import { SunEntity } from '@/canvas/entities/SunEntity'
import { useWeatherService, WeatherService } from '@/weather/services/WeatherService'

const PLANET_SIZE: number = 100

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

  constructor(params) {
    super(params)

    this._updatePlanetEntity()
  }

  private async _updatePlanetEntity(): Promise<void> {
    if (this._planetEntity) {
      this.removeChild(this._planetEntity)
    }
    const weather = await this._weatherService.getWeather()
    const sunriseTime = weather.geo.sunrise * 1000
    const sunsetTime = weather.geo.sunset * 1000
    const currentTime = Date.now()

    this._circadianCycleType
      = currentTime >= sunriseTime && currentTime <= sunsetTime
        ? CircadianCycleType.Day
        : CircadianCycleType.Night

    if (this._circadianCycleType === CircadianCycleType.Day) {
      const dayDuration = sunsetTime - sunriseTime

      this._planetEntity = new SunEntity({
        context: this.context,
        position: {
          x: (this.viewport.width / 2) - (PLANET_SIZE / 2),
          y: Math.sin(
            (Math.PI * (Date.now() - sunriseTime)) / dayDuration
          ) * this.position.height,
          width: PLANET_SIZE,
          height: PLANET_SIZE,
        },
      })
    } else {
      const nightDuration = Math.abs(sunriseTime - sunsetTime)
      
      this._planetEntity = new MoonEntity({
        context: this.context,
        position: {
          x: (this.viewport.width / 2) - (PLANET_SIZE / 2),
          y: Math.sin(
            (Math.PI * (Date.now() - sunsetTime)) / nightDuration
          ) * this.position.height,
          width: PLANET_SIZE,
          height: PLANET_SIZE,
        },
      })
    }
    this.addChild(this._planetEntity)
  }

  public update(): void {
    super.update()
    
    this._updatePlanetEntity()
  }
  
  /**
   * Empty draw method for the sky entity.
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
}