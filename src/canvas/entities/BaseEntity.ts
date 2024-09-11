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

  protected update(): void {
    this.x += this.xVelocity
    this.y += this.yVelocity
  }

  abstract render(): void

  protected setX(x: number): void {
    this.x = x
  }

  protected setY(y: number): void {
    this.y = y
  }

  protected setWidth(width: number): void {
    this.width = width
  }

  protected setHeight(height: number): void {
    this.height = height
  }
  
  protected setXVelocity(xVelocity: number): void {
    this.xVelocity = xVelocity
  }

  protected setYVelocity(yVelocity: number): void {
    this.yVelocity = yVelocity
  }

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