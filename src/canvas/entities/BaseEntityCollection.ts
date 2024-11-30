import { IEntity } from '@/canvas/interfaces/IEntity'
import { BaseEntity } from '@/canvas/entities/BaseEntity'

/**
 * Base class for entity collections in the canvas.
 */
export abstract class BaseEntityCollection extends EventTarget implements IEntity {
  public context: CanvasRenderingContext2D | undefined
  public frameWidth: number | undefined
  public frameHeight: number | undefined
  public x: number
  public y: number
  public width: number
  public height: number
  public xVelocity: number
  public yVelocity: number
  public entities: Array<BaseEntity | BaseEntityCollection> = []

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
    super()
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.xVelocity = xVelocity
    this.yVelocity = yVelocity
  }

  /**
   * Update the entity collection.
   */
  public update(): void {
    this.entities.forEach((entity) => {
      entity.update()
    })
  }

  /**
   * Render the entity collection.
   */
  public render(): void {
    this.entities.forEach((entity) => {
      entity.render()
    })
  }

  /**
   * Add an entity to the collection.
   * @param entity 
   */
  protected addEntity(entity: BaseEntity | BaseEntityCollection): void {
    this.entities.push(entity)
  }

  /**
   * Remove an entity from the collection.
   * @param entity 
   */
  public removeEntity(entity: any): void {
    const index = this.entities.indexOf(entity)
    if (index >= 0) {
      this.entities.splice(index, 1)
    }
  }

  /**
   * Set the x-position of the entity collection.
   * @param x 
   */
  protected setX(x: number): void {
    this.x = x
  }

  /**
   * Set the y-position of the entity collection.
   * @param y 
   */
  protected setY(y: number): void {
    this.y = y
  }

  /**
   * Set the width of the entity collection.
   * @param width 
   */
  protected setWidth(width: number): void {
    this.width = width
  }

  /**
   * Set the height of the entity collection.
   * @param height 
   */
  protected setHeight(height: number): void {
    this.height = height
  }
  
  /**
   * Set the x-velocity of the entity collection. 
   * @param xVelocity 
   */
  protected setXVelocity(xVelocity: number): void {
    this.xVelocity = xVelocity
  }

  /**
   * Set the y-velocity of the entity collection.
   * @param yVelocity 
   */
  protected setYVelocity(yVelocity: number): void {
    this.yVelocity = yVelocity
  }

  /**
   * Set the render context for the entity collection.
   * @param context 
   * @param frameWidth 
   * @param frameHeight 
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
