import { IEntity } from '@/canvas/interfaces/IEntity'
import { EntityEventType } from '@/canvas/enums/EntityEventType'
import { createDefaultViewport } from '@/canvas/helpers/ViewportHelper'
import { type IBoundingBox } from '@/canvas/interfaces/IBoundingBox'
import { Transition } from '@/canvas/transitions/Transition'
import { AdvancedEventTarget } from '@/canvas/events/AdvancedEventTarget'

/**
 * Base class for all entities in the canvas.
 */
export abstract class AbstractEntity extends AdvancedEventTarget implements IEntity {
  public abstract name: string
  public context: CanvasRenderingContext2D
  public frameWidth: number = 0
  public frameHeight: number = 0
  public position: IBoundingBox
  public viewport: IBoundingBox
  public xVelocity: number
  public yVelocity: number
  public rotationVelocity: number
  public entities: Map<string, Array<AbstractEntity>> = new Map()
  private _isVisible: boolean = false

  protected transition: Transition | undefined = undefined

  protected static isAssetsLoaded: boolean = false
  protected static assets: Map<string, any>

  /**
   * Create a new AbstractEntity.
   */
  constructor({
    context,
    position,
    viewport = createDefaultViewport(),
    xVelocity = 0,
    yVelocity = 0,
    rotationVelocity = 0
  }: {
    context: CanvasRenderingContext2D
    position: IBoundingBox
    viewport?: IBoundingBox
    xVelocity?: number
    yVelocity?: number
    rotationVelocity?: number
  }) {
    super()
    this.context = context
    this.position = position
    this.viewport = viewport
    this.xVelocity = xVelocity
    this.yVelocity = yVelocity
    this.rotationVelocity = rotationVelocity

    if (!this.position.rotation) {
      this.position.rotation = 0
    }
  }

  /**
   * Destroy the entity.
   */
  public destroy(): void {
    this.removeAllEventListeners()

    this.entities.forEach((collection) => {
      if (Array.isArray(collection)) {
        collection.forEach((childEntity) => {
          childEntity.destroy()
        })
      }
    })
  }

  /**
   * Render the entity on the canvas.
   * @returns void
   */
  public render(): void {
    // Return early if the entity is not visible.
    if (!this._isVisible) return

    // Draw the entity.
    this.draw()
    
    // Render child entities.
    this.entities.forEach((collection) => {
      if (Array.isArray(collection)) {
        collection.forEach((childEntity) => {
          childEntity.render()
        })
      }
    })
  }

  public abstract draw(): void
  
  /**
   * Update the entity's position.
   * @returns void
   */
  public update(): void {
    // Check if entity was visible in the previous frame.
    const wasVisible: boolean = this._isVisible

    // Update the entity's position.
    this.position.x += this.xVelocity || 0
    this.position.y += this.yVelocity || 0
    this.position.rotation = this.rotationVelocity
      ? (this.position.rotation || 0) + this.rotationVelocity
      : this.position.rotation

    // Check if entity is visible in the current frame.
    this._isVisible = this.isWithinViewport()

    // Dispatch the 'EntityEventType.EnterFrame' or 'EntityEventType.ExitFrame' events.
    if (!wasVisible && this._isVisible) {
      this.dispatchEvent(new Event(EntityEventType.EnterFrame))
    } else if (wasVisible && !this._isVisible) {
      this.dispatchEvent(new Event(EntityEventType.ExitFrame))
    }

    // Update child entities.
    this.entities.forEach((collection) => {
      if (Array.isArray(collection)) {
        collection.forEach((childEntity) => {
          childEntity.update()
        })
      }
    })
  }

  /**
   * Add a child entity.
   * @param entity 
   */
  public addChild(key: string, entity: AbstractEntity): void {
    if (this.frameWidth && this.frameHeight) {
      entity.setFrameSize(this.frameWidth, this.frameHeight)
    }
    if (!this.entities.has(key)) {
      this.entities.set(key, [])
    }
    this.entities.get(key)?.push(entity) 
  }

  /**
   * Remove a child entity.
   * @param entity 
   */
  public removeChild(key: string, entity: AbstractEntity): void {
    const entities = this.entities.get(key)
    const index = entities?.indexOf(entity) || -1
    if (index > -1) {
      entities?.splice(index, 1)
    }
  }

  /**
   * Get a child entity by key.
   * @param key 
   * @returns AbstractEntity[]
   */
  public getChildByKey(key: string): AbstractEntity[] {
    return this.entities.get(key) || []
  }

  /**
   * Resize the entity.
   */
  public resize({
    position,
    viewport,
  }: {
    position?: IBoundingBox
    viewport?: IBoundingBox
  }) {
    this.position = position || this.position
    this.viewport = viewport || this.viewport
  }

  /**
   * Set the entity's x-position.
   * @param x The new x-position.
   * @returns void
   */
  public setX(x: number): void {
    this.position.x = x
  }

  /**
   * Set the entity's y-position.
   * @param y The new y-position.
   * @returns void
   */
  public setY(y: number): void {
    this.position.y = y
  }

  /**
   * Set the entity's width.
   * @param width The new width.
   * @returns void
   */
  public setWidth(width: number): void {
    this.position.width = width
  }

  /**
   * Set the entity's height.
   * @param height The new height.
   * @returns void
   */
  public setHeight(height: number): void {
    this.position.height = height
  }
  
  /**
   * Set the entity's x-velocity.
   * @param xVelocity The new x-velocity.
   * @returns void
   */
  public setXVelocity(xVelocity: number): void {
    this.xVelocity = xVelocity
  }

  /**
   * Set the entity's y-velocity.
   * @param yVelocity The new y-velocity.
   * @returns void
   */
  public setYVelocity(yVelocity: number): void {
    this.yVelocity = yVelocity
  }

  /**
   * Set the transition for the entity.
   * @param transition 
   */
  public setTransition(transition: Transition): void {
    this.transition = transition
  }

  /**
   * Set the context and frame dimensions for rendering.
   * @param context The canvas rendering context.
   * @returns void
   */
  public setRenderContext(context: CanvasRenderingContext2D): void {
    this.context = context
    
    this.entities.forEach((collection) => {
      if (Array.isArray(collection)) {
        collection.forEach((childEntity) => {
          childEntity.setRenderContext(context)
        })
      }
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

    this.entities.forEach((collection) => {
      if (Array.isArray(collection)) {
        collection.forEach((entity) => {
          entity.setFrameSize(width, height)
        })
      }
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
  public setViewport(viewport: IBoundingBox): void {
    this.viewport = viewport
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

  /**
   * Returns a boolean indicating whether the entity is within the viewport.
   * @returns boolean
   */
  public isWithinViewport(): boolean {
    return (
      this.position.x + this.position.width > this.viewport.x && // Right edge is visible.
      this.position.x < this.viewport.width && // Left edge is visible.
      this.position.y + this.position.height > this.viewport.y && // Bottom edge is visible.
      this.position.y < this.viewport.height // Top edge is visible.
    )
  }
}
