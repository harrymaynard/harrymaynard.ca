import { type IBoundingBox } from '@/canvas/interfaces/IBoundingBox'

export interface IEntity {
  position: IBoundingBox
  viewport: IBoundingBox
  xVelocity?: number
  yVelocity?: number
  context?: CanvasRenderingContext2D
  frameWidth?: number
  frameHeight?: number
  update: () => void
  render: () => void
}
