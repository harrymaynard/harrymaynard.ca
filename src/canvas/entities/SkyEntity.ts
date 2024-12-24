import { AbstractEntity } from '@/canvas/entities/AbstractEntity'
import { CircadianCycleEntity } from '@/canvas/entities/CircadianCycleEntity'
import { WeatherEntityFactory } from '@/canvas/factories/WeatherEntityFactory'
import { WeatherFactory } from '@/weather/factories/WeatherFactory'
import { WeatherCodeType } from '@/weather/enums/WeatherCodeType'
import { useFeatureFlagStore } from '@/store/FeatureFlagStore'
import { useWeatherService, WeatherServiceEventType, WeatherService } from '@/weather/services/WeatherService'

/**
 * Circadian cycle entity, which renders sun, moon, and sky.
 */
export class SkyEntity extends AbstractEntity {
  private _weatherService: WeatherService = useWeatherService()
  private _weatherSkyEntity: AbstractEntity | null = null
  
  constructor(params) {
    super(params)

    this._renderWeatherEntities = this._renderWeatherEntities.bind(this)

    this._weatherService.addEventListener(WeatherServiceEventType.Updated, this._renderWeatherEntities)

    const { context, position } = params

    // Render circadian cycle entity.
    const circadianCycleEntity = new CircadianCycleEntity({
      context,
      position: {
        x: position.x,
        y: position.y,
        width: position.width,
        height: position.height,
      },
    })
    this.addChild(circadianCycleEntity)

    this._renderWeatherEntities()
  }

  private _renderWeatherEntities = (): void => {
    const featureFlagStore = useFeatureFlagStore()
    const weatherData = this._weatherService.getWeather()
    if (!weatherData) return

    // Show snow if it's December and date is less than or equal to Boxing Day.
    const dateToday: Date = new Date()
    if (
      dateToday.getMonth() === 11 &&
      dateToday.getDate() <= 26
    ) {
      const weatherEntityFactory = new WeatherEntityFactory({
        parentEntity: this,
      })
      const skyEntity = weatherEntityFactory.create(WeatherCodeType.Snow)
      if (skyEntity) {
        this.addChild(skyEntity)
      }
    }
    
    // Show weather entities if weather is enabled.
    else if (featureFlagStore.isWeatherEnabled) {
      // Remove the existing weather entity.
      if (this._weatherSkyEntity) {
        this.removeChild(this._weatherSkyEntity)
      }

      const weatherEntityFactory = new WeatherEntityFactory({
        parentEntity: this,
      })
      const weatherType: WeatherCodeType = WeatherFactory.createWeatherCodeType(
        weatherData.weather.conditions[0].code
      )
      this._weatherSkyEntity = weatherEntityFactory.create(weatherType)
      
      if (this._weatherSkyEntity) {
        this.addChild(this._weatherSkyEntity)
      }
    }
  }

  /**
   * Empty draw method for the sky entity.
   */
  public draw(): void {}
}