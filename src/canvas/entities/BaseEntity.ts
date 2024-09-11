/**
 * Base class for all entities in the canvas.
 */
export class BaseEntity {
  protected context: CanvasRenderingContext2D
  protected frameWidth: number
  protected frameHeight: number
  protected x: number
  protected y: number
  protected width: number
  protected height: number
  protected xVelocity: number
  protected yVelocity: number

  /**
   * Create a new BaseEntity.
   */
  constructor({
    x,
    y,
    width,
    height,
    xVelocity = 0,
    yVelocity = 0,
  }: {
    x: number
    y: number
    width: number
    height: number
    xVelocity?: number
    yVelocity?: number
  }) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.xVelocity = xVelocity
    this.yVelocity = yVelocity
  }

  /**
   * Render the entity on the canvas.
   * @returns void
   */
  abstract render(): void
  
  /**
   * Update the entity's position.
   * @returns void
   */
  protected update(): void {
    this.x += this.xVelocity || 0
    this.y += this.yVelocity || 0
  }

  /**
   * Set the entity's x-position.
   * @param x The new x-position.
   * @returns void
   */
  protected setX(x: number): void {
    this.x = x
  }

  /**
   * Set the entity's y-position.
   * @param y The new y-position.
   * @returns void
   */
  protected setY(y: number): void {
    this.y = y
  }

  /**
   * Set the entity's width.
   * @param width The new width.
   * @returns void
   */
  protected setWidth(width: number): void {
    this.width = width
  }

  /**
   * Set the entity's height.
   * @param height The new height.
   * @returns void
   */
  protected setHeight(height: number): void {
    this.height = height
  }
  
  /**
   * Set the entity's x-velocity.
   * @param xVelocity The new x-velocity.
   * @returns void
   */
  protected setXVelocity(xVelocity: number): void {
    this.xVelocity = xVelocity
  }

  /**
   * Set the entity's y-velocity.
   * @param yVelocity The new y-velocity.
   * @returns void
   */
  protected setYVelocity(yVelocity: number): void {
    this.yVelocity = yVelocity
  }

  /**
   * Set the context and frame dimensions for rendering.
   * @param context The canvas rendering context.
   * @param frameWidth The width of the frame.
   * @param frameHeight The height of the frame.
   * @returns void
   */
  public setRenderContext(
    context: CanvasRenderingContext2D,
    frameWidth: number,
    frameHeight: number
  ): void {
    this.context = context
    this.frameWidth = frameWidth
    this.frameHeight = frameHeight
  }
}