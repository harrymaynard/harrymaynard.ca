import { AbstractEntity } from '@/canvas/entities/AbstractEntity'
import { MoonEntity } from '@/canvas/entities/MoonEntity'
import { SunEntity } from '@/canvas/entities/SunEntity'

const PLANET_MAX_X_PADDING: number = 50
const PLANET_SIZE: number = 100
// const SUNRISE_TIME: number = 1733673155 // Temporary value
// const SUNSET_TIME: number = 1733703525 // Temporary value

enum CircadianCycleType {
  Day = 'day',
  Night = 'night',
}

/**
 * Circadian cycle entity, which renders sun, moon, and sky.
 */
export class CircadianCycleEntity extends AbstractEntity {
  private _circadianCycleType: CircadianCycleType = CircadianCycleType.Day
  private _planetEntity: AbstractEntity | null = null

  constructor(params) {
    super(params)

    this._updatePlanetEntity()
  }

  private _updatePlanetEntity(): void {
    if (this._planetEntity) {
      this.removeChild(this._planetEntity)
    }

    if (this._circadianCycleType === CircadianCycleType.Day) {
      this._planetEntity = new SunEntity({
        context: this.context,
        position: {
          x: (this.viewport.width / 2) - (PLANET_SIZE / 2),
          y: this.position.y + PLANET_MAX_X_PADDING,
          width: PLANET_SIZE,
          height: PLANET_SIZE,
        },
      })
    } else {
      this._planetEntity = new MoonEntity({
        context: this.context,
        position: {
          x: (this.viewport.width / 2) - (PLANET_SIZE / 2),
          y: this.viewport.y + PLANET_MAX_X_PADDING,
          width: PLANET_SIZE,
          height: PLANET_SIZE,
        },
      })
    }
    this.addChild(this._planetEntity)
  }

  public update(): void {
    super.update()
  }
  
  /**
   * Empty draw method for the sky entity.
   */
  public draw(): void {
    // Draw the sky.
    this.context.fillStyle = 'rgba(0, 0, 0, 0.5)'
    this.context.fillRect(
      this.position.x,
      this.position.y,
      this.position.width,
      this.position.height
    )
  }
}