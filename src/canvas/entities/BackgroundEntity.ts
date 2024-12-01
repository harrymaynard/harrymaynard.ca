import { BaseEntity } from '@/canvas/entities/BaseEntity'

const BACKGROUND_COLOR: string = '#FFF'

/**
 * Represents a background entity on the canvas.
 * @extends BaseEntity
 */
export class BackgroundEntity extends BaseEntity {
  /**
   * Render the entity on the canvas.
   * @returns void
   */
  public render(): void {
    this.context.fillStyle = BACKGROUND_COLOR
    this.context.fillRect(0, 0, this.width, this.height)
  }
}