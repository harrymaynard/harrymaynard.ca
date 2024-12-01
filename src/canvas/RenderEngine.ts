import { AbstractEntity } from './entities/AbstractEntity'

/**
 * Represents the render engine for a canvas.
 * @class
 */
export class RenderEngine {
  private _context: CanvasRenderingContext2D | undefined
  private _frameWidth: number | undefined
  private _frameHeight: number | undefined
  private readonly _entities: Array<AbstractEntity> = []
  
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
  public addEntity(entity: AbstractEntity): void {
    if (this.isRenderContextValid()) {
      // @ts-expect-error - TS2532: Object is possibly 'undefined'.
      entity.setRenderContext(this._context)
      // @ts-expect-error - TS2532: Object is possibly 'undefined'.
      entity.setFrameSize(this._frameWidth, this._frameHeight)
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
   * @returns void
   */
  public setRenderContext(context: CanvasRenderingContext2D): void {
    this._context = context
    
    this._entities.forEach((entity) => {
      entity.setRenderContext(context)
    })
  }

  /**
   * Set the frame size.
   * @param width 
   * @param height 
   */
  public setFrameSize(width: number, height: number): void {
    this._frameWidth = width
    this._frameHeight = height

    this._entities.forEach((entity) => {
      entity.setFrameSize(width, height)
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