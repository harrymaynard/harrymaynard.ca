import { AbstractEntity } from '@/canvas/entities/AbstractEntity'

/**
 * Sun entity.
 */
export class SunEntity extends AbstractEntity {
  public readonly name: string = 'sun'
 
  /**
   * Draw the entity on the canvas.
   * @returns void
   */
  public draw(): void {
    const radius: number = this.position.width / 2
    const opacity: number = this.transition?.getValue() || 1

    this.context.fillStyle = `rgba(255, 204, 51, ${opacity})`
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
