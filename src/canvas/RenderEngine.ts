import { BaseEntity } from './entities/BaseEntity'
import { BaseEntityCollection } from './entities/BaseEntityCollection'

/**
 * Represents the render engine for a canvas.
 * @class
 */
export class RenderEngine {
  private _context: CanvasRenderingContext2D | undefined
  private _frameWidth: number | undefined
  private _frameHeight: number | undefined
  private readonly _entities: Array<BaseEntity | BaseEntityCollection> = []
  
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
    // Early return if the render context is not valid.
    if (!this.isRenderContextValid()) return

    // Clear the canvas.
    // @ts-expect-error - TS2532: Object is possibly 'undefined'.
    this._context.clearRect(0, 0, this._frameWidth, this._frameHeight)

    // Render each entity.
    this._entities.forEach((entity) => {
      entity.render()
    })
  }

  /**
   * Add an entity to the render engine instance.
   * @param entity The entity to add.
   * @returns void
   */
  public addEntity(entity: BaseEntity | BaseEntityCollection): void {
    if (this.isRenderContextValid()) {
      entity.setRenderContext(
        // @ts-expect-error - TS2532: Object is possibly 'undefined'.
        this._context,
        this._frameWidth,
        this._frameHeight
      )
    }
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

  /**
   * Returns a boolean indicating whether the render context is set.
   * @returns boolean
   */
  public isRenderContextValid(): boolean {
    return (
      !!this._context &&
      !!this._frameWidth &&
      !!this._frameHeight
    )
  }
}