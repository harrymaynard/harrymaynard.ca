import { BaseEntity } from './entities/BaseEntity'

export class RenderEngine {
  private _context: CanvasRenderingContext2D
  private _frameWidth: number
  private _frameHeight: number
  private readonly _entities: Array<BaseEntity> = []
  
  public update(): void {
    this._entities.forEach((entity) => {
      entity.update()
    })
  }

  public render(): void {
    this._context.clearRect(0, 0, this._frameWidth, this._frameHeight)
    this._entities.forEach((entity) => {
      entity.render()
    })
  }

  public addEntity(entity: BaseEntity): void {
    entity.setRenderContext(
      this._context,
      this._frameWidth,
      this._frameHeight
    )
    this._entities.push(entity)
  }

  public removeEntity(entity: any): void {
    const index = this._entities.indexOf(entity)
    if (index >= 0) {
      this._entities.splice(index, 1)
    }
  }

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