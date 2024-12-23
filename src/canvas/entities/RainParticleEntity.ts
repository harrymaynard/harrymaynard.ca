import { AbstractEntity } from '@/canvas/entities/AbstractEntity'

/**
 * Cloud particle entity.
 */
export class RainParticleEntity extends AbstractEntity {
  /**
   * Draw the entity on the canvas.
   * @returns void
   */
  public draw(): void {
    this.context.fillStyle = `#679ebf`
    this.context.fillRect(
      this.position.x,
      this.position.y,
      3,
      this.position.height
    )
  }
}
