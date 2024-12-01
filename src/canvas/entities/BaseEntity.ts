import { IEntity } from '@/canvas/interfaces/IEntity'

/**
 * Base class for all entities in the canvas.
 */
export abstract class BaseEntity extends EventTarget implements IEntity {
  public context: CanvasRenderingContext2D
  public frameWidth: number = 0
  public frameHeight: number = 0
  public viewportX: number = 0
  public viewportY: number = 0
  public viewportWidth: number = 0
  public viewportHeight: number = 0
  public x: number
  public y: number
  public width: number
  public height: number
  public xVelocity: number
  public yVelocity: number
  public entities: Array<BaseEntity> = []

  /**
   * Create a new BaseEntity.
   */
  constructor({
    context,
    x,
    y,
    width,
    height,
    xVelocity = 0,
    yVelocity = 0,
  }: {
    context: CanvasRenderingContext2D
    x: number
    y: number
    width: number
    height: number
    xVelocity?: number
    yVelocity?: number
  }) {
    super()
    this.context = context
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
  public render(): void {
    this.entities.forEach((entity) => {
      entity.render()
    })
  }
  
  /**
   * Update the entity's position.
   * @returns void
   */
  public update(): void {
    this.x += this.xVelocity || 0
    this.y += this.yVelocity || 0

    this.entities.forEach((entity) => {
      entity.update()
    })
  }

  /**
   * Add a child entity.
   * @param entity 
   */
  public addChild(entity: BaseEntity): void {
    this.entities.push(entity)
  }

  /**
   * Remove a child entity.
   * @param entity 
   */
  public removeChild(entity: BaseEntity): void {
    const index = this.entities.indexOf(entity)
    if (index > -1) {
      this.entities.splice(index, 1)
    }
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
  public setWidth(width: number): void {
    this.width = width
  }

  /**
   * Set the entity's height.
   * @param height The new height.
   * @returns void
   */
  public setHeight(height: number): void {
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
   * @returns void
   */
  public setRenderContext(context: CanvasRenderingContext2D): void {
    this.context = context
    
    this.entities.forEach((entity) => {
      entity.setRenderContext(context)
    })
  }

  /**
   * Set the frame size.
   * @param width 
   * @param height 
   * @returns void
   */
  public setFrameSize(
    width: number,
    height: number
  ): void {
    this.frameWidth = width
    this.frameHeight = height

    this.entities.forEach((entity) => {
      entity.setFrameSize(width, height)
    })
  }

  /**
   * Set the viewport.
   * @param x 
   * @param y 
   * @param width 
   * @param height 
   * @returns void
   */
  public setViewport(
    x: number,
    y: number,
    width: number,
    height: number
  ): void {
    this.viewportX = x
    this.viewportY = y
    this.viewportWidth = width
    this.viewportHeight = height
  }

  /**
   * Returns a boolean indicating whether the render context is set.
   * @returns boolean
   */
  public isRenderContextValid(): boolean {
    return (
      !!this.context &&
      !!this.frameWidth &&
      !!this.frameHeight
    )
  }
}