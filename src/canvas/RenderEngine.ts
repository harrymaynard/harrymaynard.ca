import { BaseEntity } from './entities/BaseEntity'

/**
 * Represents the render engine for a canvas.
 * @class
 */
export class RenderEngine {
  private _context: CanvasRenderingContext2D
  private _frameWidth: number
  private _frameHeight: number
  private readonly _entities: Array<BaseEntity> = []
  
  /**
   * Updates all entities in the render engine instance.
   * @returns void
   */
  public update(): void {
    this._entities.forEach((entity) => {
      entity.update()
    })
  }

  /**
   * Renders all entities in the render engine instance.
   * @returns void
   */
  public render(): void {
    this._context.clearRect(0, 0, this._frameWidth, this._frameHeight)
    this._entities.forEach((entity) => {
      entity.render()
    })
  }

  /**
   * Add an entity to the render engine instance.
   * @param entity The entity to add.
   * @returns void
   */
  public addEntity(entity: BaseEntity): void {
    entity.setRenderContext(
      this._context,
      this._frameWidth,
      this._frameHeight
    )
    this._entities.push(entity)
  }

  /**
   * Remove an entity from the render engine instance.
   * @param entity The entity to remove.
   * @returns void
   */
  public removeEntity(entity: any): void {
    const index = this._entities.indexOf(entity)
    if (index >= 0) {
      this._entities.splice(index, 1)
    }
  }

  /**
   * Set the render context for the render engine instance.
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
    this._context = context
    this._frameWidth = frameWidth
    this._frameHeight = frameHeight

    this._entities.forEach((entity) => {
      entity.setRenderContext(context, frameWidth, frameHeight)
    })
  }
}