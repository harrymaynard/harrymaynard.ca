import { AbstractEntity } from '@/canvas/entities/AbstractEntity'
import { BackgroundEntity } from '@/canvas/entities/BackgroundEntity'
import { SkyEntity } from '@/canvas/entities/SkyEntity'
import { WaveEntity } from '@/canvas/entities/WaveEntity'

/**
 * The root entity to be drawn on the canvas.
 * @extends AbstractEntity
 */
export class RootEntity extends AbstractEntity {

  constructor(params) {
    super(params)

    const { context, position } = params

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
    const skyEntity = new SkyEntity({
      context,
      position: {
        x: position.x,
        y: position.y,
        width: position.width,
        height: position.height / 2 + 30,
      },
    })
    this.addChild(skyEntity)
    
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
  
  /**
   * Empty draw method for the root entity.
   */
  public draw(): void {}
}