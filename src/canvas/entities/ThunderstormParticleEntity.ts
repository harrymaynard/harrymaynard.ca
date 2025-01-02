import { AbstractEntity } from '@/canvas/entities/AbstractEntity'
import { ICoordinates } from '@/canvas/interfaces/ICoordinates'
import { getRandomNumberInRange } from '@/canvas/helpers/NumberHelper'
import { Transition } from '@/canvas/transitions/Transition'
import { TransitionEventType } from '@/canvas/enums/TransitionEventType'
import { EntityEventType } from '../enums/EntityEventType'

const X_LIGHTNING_STEP_DISTANCE = 30
const MIN_Y_LIGHTNING_STEP_DISTANCE = 10
const MAX_Y_LIGHTNING_STEP_DISTANCE = 50
const LIGHTNING_FADE_OUT_DURATION = 1000

/**
 * Cloud particle entity.
 */
export class ThunderstormParticleEntity extends AbstractEntity {
  public readonly name: string = 'thunderstorm-particle'
  private _lightningPoints: Array<ICoordinates> = []
  private _hasLightningReachedGround: boolean = false

  constructor(params) {
    super(params)

    this._onFadeOutComplete = this._onFadeOutComplete.bind(this)

    const { viewport } = params

    const startingLightningPoint: ICoordinates = {
      x: Math.random() * viewport.width,
      y: 0,
    }
    this._lightningPoints.push(startingLightningPoint)
  }

  public update(): void {
    super.update()

    if (this._hasLightningReachedGround) return

    const lastLightningPoint = this._lightningPoints[this._lightningPoints.length - 1]
    const nextX: number = lastLightningPoint.x + getRandomNumberInRange(
      -X_LIGHTNING_STEP_DISTANCE,
      X_LIGHTNING_STEP_DISTANCE
    )
    const nextY: number = lastLightningPoint.y + getRandomNumberInRange(
      MIN_Y_LIGHTNING_STEP_DISTANCE,
      MAX_Y_LIGHTNING_STEP_DISTANCE
    )
    const nextPoint: ICoordinates = {
      x: nextX,
      y: nextY,
    }
    this._lightningPoints.push(nextPoint)

    if (nextY >= this.viewport.height) {
      this._hasLightningReachedGround = true

      // Fade out the lightning.
      this.setTransition(new Transition({
        startValue: 1,
        endValue: 0,
        duration: LIGHTNING_FADE_OUT_DURATION,
      }))
      this.transition?.addEventListener(TransitionEventType.Complete, this._onFadeOutComplete)
    }
  }

  public _onFadeOutComplete = (): void => {
    this.transition?.destroy()
    this.dispatchEvent(new Event(EntityEventType.ExitFrame))
  }

  /**
   * Draw the entity on the canvas.
   * @returns void
   */
  public draw(): void {
    const opacity: number = this.transition?.getValue() || 1
    this.context.beginPath()
    this.context.strokeStyle = `rgba(245, 245, 250, ${opacity})`
    this.context.lineWidth = 3
    this.context.shadowBlur = 6
    this.context.shadowColor = `rgba(245, 245, 250, ${opacity})`

    this.context.moveTo(this._lightningPoints[0].x, this._lightningPoints[0].y)
    
    for (let i=1; i<this._lightningPoints.length; i++) { 
      const point = this._lightningPoints[i]

      this.context.lineTo(point.x, point.y)
      this.context.stroke()
    }

    this.context.shadowBlur = 0
    this.context.lineWidth = 1
  }
}
