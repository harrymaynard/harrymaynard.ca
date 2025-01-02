import { AbstractEntity } from '@/canvas/entities/AbstractEntity'
import { ThunderstormParticleEntity } from './ThunderstormParticleEntity'
import { EntityEventType } from '../enums/EntityEventType'

/**
 * ThunderstormSkyEntity class which handles the thunderstorm sky background entities.
 */
export class ThunderstormSkyEntity extends AbstractEntity {
  public readonly name: string = 'thunderstorm-sky'
  private _thunderstormParticle: ThunderstormParticleEntity | null = null

  constructor(params) {
    super(params)

    this._createThunderstormParticle = this._createThunderstormParticle.bind(this)

    this._createThunderstormParticle()
  }

  private _createThunderstormParticle(): void {
    if (this._thunderstormParticle) {
      this._thunderstormParticle.removeEventListener(EntityEventType.ExitFrame, this._createThunderstormParticle)
      this.removeChild(this._thunderstormParticle.name, this._thunderstormParticle)
    }

    this._thunderstormParticle = new ThunderstormParticleEntity({
      context: this.context,
      viewport: this.viewport,
      position: {
        x: 0,
        y: 0,
        width: this.viewport.width,
        height: this.viewport.height,
      },
    })
    this._thunderstormParticle.addEventListener(EntityEventType.ExitFrame, this._createThunderstormParticle)
    this.addChild(this._thunderstormParticle.name, this._thunderstormParticle)
  }

  /**
   * Empty draw method for the sky entity.
   */
  public draw(): void {}
}
