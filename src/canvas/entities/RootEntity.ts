import { AbstractEntity } from '@/canvas/entities/AbstractEntity'
import { BackgroundEntity } from '@/canvas/entities/BackgroundEntity'
import { WaveEntity } from '@/canvas/entities/WaveEntity'
import { WeatherEntityFactory } from '@/canvas/factories/WeatherEntityFactory'
import { WeatherCodeType } from '@/weather/enums/WeatherCodeType'
import { type IBoundingBox } from '@/canvas/interfaces/IBoundingBox'

/**
 * The root entity to be drawn on the canvas.
 * @extends AbstractEntity
 */
export class RootEntity extends AbstractEntity {

  constructor({
    context,
    position,
    viewport,
    xVelocity,
    yVelocity,
  }: {
    context: CanvasRenderingContext2D
    position: IBoundingBox
    viewport?: IBoundingBox
    xVelocity?: number
    yVelocity?: number
  }) {
    super({
      context,
      position,
      viewport,
      xVelocity,
      yVelocity
    })

    // Background entity.
    const backgroundEntity = new BackgroundEntity({
      context,
      position: {
        x: position.x,
        y: position.y,
        width: position.width,
        height: position.height,
      },
    })
    this.addChild(backgroundEntity)

    // Sky entity.
    const weatherEntityFactory = new WeatherEntityFactory({
      parentEntity: this,
    })
    const skyEntity = weatherEntityFactory.create(WeatherCodeType.Snow)
    if (skyEntity) {
      this.addChild(skyEntity)
    }
    
    // Wave entity.
    const waveEntity = new WaveEntity({
      context,
      position: {
        x: position.x,
        y: position.height / 2,
        width: position.width,
        height: position.height,
      },
      xVelocity: -1,
    })
    this.addChild(waveEntity)

    this.setFrameSize(
      position.width,
      position.height
    )
  }
  
  public draw(): void {}
}