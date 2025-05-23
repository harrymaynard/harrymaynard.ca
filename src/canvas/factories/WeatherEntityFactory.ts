import { WeatherCodeType } from '@/weather/enums/WeatherCodeType'
import { AbstractEntity } from '@/canvas/entities/AbstractEntity'
import { SnowSkyEntity } from '@/canvas/entities/SnowSkyEntity'
import { CloudSkyEntity } from '@/canvas/entities/CloudSkyEntity'
import { RainSkyEntity } from '@/canvas/entities/RainSkyEntity'
import { ThunderstormSkyEntity } from '@/canvas/entities/ThunderstormSkyEntity'

export class WeatherEntityFactory {
  private _parentEntity: AbstractEntity

  constructor({
    parentEntity,
  }: {
    parentEntity: AbstractEntity
  }) {
    this._parentEntity = parentEntity
  }

  /**
   * Create a new weather entity.
   * @param weatherCodeType 
   * @returns AbstractEntity
   */
  public create(
    weatherCodeType: WeatherCodeType
  ): AbstractEntity | null {
    switch (weatherCodeType) {
      case WeatherCodeType.Clouds:
        return new CloudSkyEntity({
          context: this._parentEntity.context,
          position: {
            x: this._parentEntity.position.x,
            y: this._parentEntity.position.y,
            width: this._parentEntity.position.width,
            height: this._parentEntity.position.height,
          },
          viewport: {
            x: this._parentEntity.position.x,
            y: this._parentEntity.position.y,
            width: this._parentEntity.position.width,
            height: this._parentEntity.position.height,
          },
        })

      case WeatherCodeType.Rain:
        return new RainSkyEntity({
          context: this._parentEntity.context,
          position: {
            x: this._parentEntity.position.x,
            y: this._parentEntity.position.y,
            width: this._parentEntity.position.width,
            height: this._parentEntity.position.height,
          },
          viewport: {
            x: this._parentEntity.position.x,
            y: this._parentEntity.position.y,
            width: this._parentEntity.position.width,
            height: this._parentEntity.position.height,
          },
        })

      case WeatherCodeType.Snow:
        return new SnowSkyEntity({
          context: this._parentEntity.context,
          position: {
            x: this._parentEntity.position.x,
            y: this._parentEntity.position.y,
            width: this._parentEntity.position.width,
            height: this._parentEntity.position.height,
          },
          viewport: {
            x: this._parentEntity.position.x,
            y: this._parentEntity.position.y,
            width: this._parentEntity.position.width,
            height: this._parentEntity.position.height,
          },
        })

      case WeatherCodeType.Thunderstorm:
        return new ThunderstormSkyEntity({
          context: this._parentEntity.context,
          position: {
            x: this._parentEntity.position.x,
            y: this._parentEntity.position.y,
            width: this._parentEntity.position.width,
            height: this._parentEntity.position.height,
          },
          viewport: {
            x: this._parentEntity.position.x,
            y: this._parentEntity.position.y,
            width: this._parentEntity.position.width,
            height: this._parentEntity.position.height,
          },
        })

      default:
        return null
    }
  }
}
