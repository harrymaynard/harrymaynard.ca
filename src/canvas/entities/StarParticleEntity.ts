import { AbstractEntity } from '@/canvas/entities/AbstractEntity'

/**
 * Star particle entity.
 */
export class StarParticleEntity extends AbstractEntity {
  public readonly name: string = 'star-particle'
  
  /**
   * Draw the entity on the canvas.
   * @returns void
   */
  public draw(): void {
    const radius: number = this.position.width / 2
    const opacity: number = this.transition?.getValue() || 1

    this.context.fillStyle = `rgba(255, 255, 255, ${opacity})`
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
