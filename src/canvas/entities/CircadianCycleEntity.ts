import { AbstractEntity } from '@/canvas/entities/AbstractEntity'
import { MoonEntity } from '@/canvas/entities/MoonEntity'
import { SunEntity } from '@/canvas/entities/SunEntity'

enum CircadianCycleType {
  Day = 'day',
  Night = 'night',
}

/**
 * Circadian cycle entity, which renders sun, moon, and sky.
 */
export class CircadianCycleEntity extends AbstractEntity {
  private _circadianCycleType: CircadianCycleType = CircadianCycleType.Day

  constructor(params) {
    super(params)

    // Moon entity.
    const moonEntity = new MoonEntity({
      context: this.context,
      position: {
        x: this.position.x,
        y: this.position.y,
        width: 100,
        height: 100,
      },
    })
    this.addChild(moonEntity)

    // Sun entity.
    const sunEntity = new SunEntity({
      context: this.context,
      position: {
        x: this.position.x + 100,
        y: this.position.y,
        width: 100,
        height: 100,
      },
    })
    this.addChild(sunEntity)
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