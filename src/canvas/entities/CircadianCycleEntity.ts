import { AbstractEntity } from '@/canvas/entities/AbstractEntity'
import { MoonEntity } from '@/canvas/entities/MoonEntity'
import { SunEntity } from '@/canvas/entities/SunEntity'
import { IWeatherResponseDTO } from '@/weather/interfaces/IWeatherResponseDTO'
import { useWeatherService, WeatherService } from '@/weather/services/WeatherService'
import { Transition } from '@/canvas/transitions/Transition'
import { EntityKeyType } from '@/canvas/enums/EntityKeyType'

const PLANET_SIZE: number = 100
const SINGLE_DAY_DURATION: number = 24 * 60 * 60 * 1000
const NIGHT_SKY_TRANSITION_DURATION: number = 2000

enum CircadianCycleType {
  Day = 'day',
  Night = 'night',
}

/**
 * Circadian cycle entity, which renders sun, moon, and sky.
 */
export class CircadianCycleEntity extends AbstractEntity {
  public readonly name: string = 'circadian-cycle'
  private _circadianCycleType: CircadianCycleType = CircadianCycleType.Day
  private _planetEntity: AbstractEntity | null = null
  private _weatherService: WeatherService = useWeatherService()
  private _cachedWeatherData: IWeatherResponseDTO | null = null
  private _fadeTransition: Transition | null = null

  constructor(params) {
    super(params)

    this._renderSun = this._renderSun.bind(this)
    this._renderMoon = this._renderMoon.bind(this)

    this._updatePlanetEntity()
  }

  /**
   * Change the planet entity based on the time of day, in accordance with the sunrise and sunset times.
   * @returns void
   */
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
      (!this._planetEntity && !this._fadeTransition)
    ) {
      if (this._planetEntity) {
        this.removeChild(EntityKeyType.Planet, this._planetEntity)
      }

      // Day time.
      if (circadianCycleType === CircadianCycleType.Day) {
        if (!this._planetEntity) {
          this._renderSun(circadianCycleType, sunriseTime, sunsetTime)
        } else {
          this._fadeTransition?.destroy()
          this._fadeTransition = new Transition({
            startValue: 0.5,
            endValue: 0,
            duration: NIGHT_SKY_TRANSITION_DURATION,
          })
          this._renderSun(circadianCycleType, sunriseTime, sunsetTime)
        }
      }
      // Night time.
      else {
        this._fadeTransition?.destroy()
        this._fadeTransition = new Transition({
          startValue: 0,
          endValue: 0.5,
          duration: NIGHT_SKY_TRANSITION_DURATION,
        })
        this._renderMoon(circadianCycleType, sunriseTime, sunsetTime)
      }
      this._circadianCycleType = circadianCycleType
    } else if (this._planetEntity) {
      const x: number = (this.viewport.width / 2) - (PLANET_SIZE / 2)
      const y: number = this._getPlanetYPosition(
        circadianCycleType,
        sunriseTime,
        sunsetTime
      )
      this._planetEntity.setX(x)
      this._planetEntity.setY(y)
    }
  }

  /**
   * Update the circadian cycle entity.
   */
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
      this.context.fillStyle = `rgba(0, 0, 0, ${this._fadeTransition?.getValue() || 0})`
      this.context.fillRect(
        this.position.x,
        this.position.y,
        this.position.width,
        this.position.height
      )
    }
  }

  /**
   * Get the Y position of the planet entity.
   * @param circadianCycleType 
   * @param sunriseTime 
   * @param sunsetTime 
   * @returns number
   */
  private _getPlanetYPosition(
    circadianCycleType: CircadianCycleType,
    sunriseTime: number,
    sunsetTime: number
  ): number {
    let planetDisplayDuration: number = 1
    
    if (Date.now() < sunriseTime) {
      sunsetTime -= SINGLE_DAY_DURATION
    }

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

  private _renderSun(
    circadianCycleType: CircadianCycleType,
    sunriseTime: number,
    sunsetTime: number
  ): void {
    const x: number = (this.viewport.width / 2) - (PLANET_SIZE / 2)
    const y: number = this._getPlanetYPosition(
      circadianCycleType,
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
    this._planetEntity.setTransition(new Transition({
      startValue: 0,
      endValue: 1,
      duration: NIGHT_SKY_TRANSITION_DURATION,
    }))
    
    this.addChild(EntityKeyType.Planet, this._planetEntity)
  }

  private _renderMoon(
    circadianCycleType: CircadianCycleType,
    sunriseTime: number,
    sunsetTime: number
  ): void {
    const x: number = (this.viewport.width / 2) - (PLANET_SIZE / 2)
    const y: number = this._getPlanetYPosition(
      circadianCycleType,
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
    this._planetEntity.setTransition(new Transition({
      startValue: 0,
      endValue: 1,
      duration: NIGHT_SKY_TRANSITION_DURATION,
    }))
    this.addChild(EntityKeyType.Planet, this._planetEntity)
  }
}
