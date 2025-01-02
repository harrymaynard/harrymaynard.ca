import { AbstractEntity } from '@/canvas/entities/AbstractEntity'
import { BackgroundEntity } from '@/canvas/entities/BackgroundEntity'
import { SkyEntity } from '@/canvas/entities/SkyEntity'
import { WaveEntity } from '@/canvas/entities/WaveEntity'
import { EntityKeyType } from '@/canvas/enums/EntityKeyType'

/**
 * The root entity to be drawn on the canvas.
 * @extends AbstractEntity
 */
export class RootEntity extends AbstractEntity {
  public readonly name: string = 'root'

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
    this.addChild(EntityKeyType.Background, backgroundEntity)

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
    this.addChild(EntityKeyType.Sky, skyEntity)
    
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
    this.addChild(EntityKeyType.Wave, waveEntity)

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