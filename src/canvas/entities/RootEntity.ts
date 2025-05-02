import { AbstractEntity } from '@/canvas/entities/AbstractEntity'
import { BackgroundEntity } from '@/canvas/entities/BackgroundEntity'
import { SkyEntity } from '@/canvas/entities/SkyEntity'
import { WaveEntity } from '@/canvas/entities/WaveEntity'
import { EntityKeyType } from '@/canvas/enums/EntityKeyType'
import { EntityDOMEventType } from '@/canvas/enums/EntityDOMEventType'

/**
 * The root entity to be drawn on the canvas.
 * @extends AbstractEntity
 */
export class RootEntity extends AbstractEntity {
  public readonly name: string = 'root'

  constructor(params) {
    super(params)

    this._handleResize = this._handleResize.bind(this)

    window.addEventListener(EntityDOMEventType.Resize, this._handleResize)

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

  public destroy(): void {
    super.destroy()

    window.removeEventListener(EntityDOMEventType.Resize, this._handleResize)
  }
  
  /**
   * Empty draw method for the root entity.
   */
  public draw(): void {}

  /**
   * Handle the window resize event.
   */
  private _handleResize = (): void => {
    this.position.width = document.body.clientWidth
    this.position.height = document.body.clientHeight
    this.viewport.width = document.body.clientWidth
    this.viewport.height = document.body.clientHeight

    // Background entity.
    const backgroundEntity = this.getChildByKey(EntityKeyType.Background)[0]
    backgroundEntity.resize({
      position: this.position
    })
    
    // Sky entity.
    const skyEntity = this.getChildByKey(EntityKeyType.Sky)[0]
    skyEntity.resize({
      position: {
        ...this.position,
        height: this.position.height / 2 + 30,
      },
      viewport: this.viewport,
    })

    // Wave entity.
    const waveEntity = this.getChildByKey(EntityKeyType.Wave)[0]
    waveEntity.resize({
      position: {
        ...waveEntity.position,
        y: this.position.height / 2,
      },
      viewport: this.viewport,
    })
  }
}