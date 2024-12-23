import { AbstractEntity } from '@/canvas/entities/AbstractEntity'
import { CircadianCycleEntity } from '@/canvas/entities/CircadianCycleEntity'
import { WeatherEntityFactory } from '@/canvas/factories/WeatherEntityFactory'
import { WeatherCodeType } from '@/weather/enums/WeatherCodeType'
import { useFeatureFlagStore } from '@/store/FeatureFlagStore'

/**
 * Circadian cycle entity, which renders sun, moon, and sky.
 */
export class SkyEntity extends AbstractEntity {
  
  constructor(params) {
    super(params)

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

    const featureFlagStore = useFeatureFlagStore()
    
    if (featureFlagStore.isWeatherEnabled) {
      // Sky entity.
      const weatherEntityFactory = new WeatherEntityFactory({
        parentEntity: this,
      })
      const skyEntity = weatherEntityFactory.create(WeatherCodeType.Clouds)
      if (skyEntity) {
        this.addChild(skyEntity)
      }
    }
  }

  /**
   * Empty draw method for the sky entity.
   */
  public draw(): void {}
}