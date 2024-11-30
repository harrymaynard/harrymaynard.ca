export interface IEntity {
  x: number
  y: number
  width: number
  height: number
  xVelocity?: number
  yVelocity?: number
  context?: CanvasRenderingContext2D
  frameWidth?: number
  frameHeight?: number
  update: () => void
  render: () => void
}
