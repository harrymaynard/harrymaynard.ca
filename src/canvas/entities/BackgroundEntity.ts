import { AbstractEntity } from '@/canvas/entities/AbstractEntity'

const BACKGROUND_COLOR: string = '#FFF'

/**
 * Represents a background entity on the canvas.
 * @extends AbstractEntity
 */
export class BackgroundEntity extends AbstractEntity {
  /**
   * Render the entity on the canvas.
   * @returns void
   */
  public draw(): void {
    this.context.fillStyle = BACKGROUND_COLOR
    this.context.fillRect(
      this.position.x,
      this.position.y,
      this.position.width,
      this.position.height
    )
  }
}