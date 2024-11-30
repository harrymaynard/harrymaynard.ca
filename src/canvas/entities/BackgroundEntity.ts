import { BaseEntity } from '@/canvas/entities/BaseEntity'

const BACKGROUND_COLOR: string = '#FFF'

/**
 * Represents a background entity on the canvas.
 * @extends BaseEntity
 */
export class BackgroundEntity extends BaseEntity {
  
  /**
   * Create a new BackgroundEntity.
   */
  constructor({
    x,
    y,
    width,
    height,
    xVelocity,
    yVelocity,
  }: {
    x: number
    y: number
    width: number
    height: number
    xVelocity?: number
    yVelocity?: number
  } = {
    x: 0,
    y: 0,
    width: document.body.clientWidth,
    height: document.body.clientHeight,
    xVelocity: 0,
    yVelocity: 0,
  }) {
    super({ x, y, width, height, xVelocity, yVelocity })
  }

  /**
   * Render the entity on the canvas.
   * @returns void
   */
  public render(): void {
    // Early return if the render context is not valid.
    if (!this.isRenderContextValid()) return

    // @ts-expect-error - TS2532: Object is possibly 'undefined'.
    this.context.fillStyle = BACKGROUND_COLOR

    // @ts-expect-error - TS2532: Object is possibly 'undefined'.
    this.context.fillRect(0, 0, this.frameWidth, this.frameHeight)
  }
}