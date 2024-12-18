import { AbstractEntity } from '@/canvas/entities/AbstractEntity'

/**
 * Sun entity.
 */
export class SunEntity extends AbstractEntity {
 
  /**
   * Draw the entity on the canvas.
   * @returns void
   */
  public draw(): void {
    const radius: number = this.position.width / 2

    this.context.fillStyle = '#FFCC33'
    this.context.beginPath()
    this.context.arc(
      this.position.x + radius,
      this.position.y + radius,
      radius,
      0,
      Math.PI * 2
    )
    this.context.fill()
  }
}
