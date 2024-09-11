import { BaseEntity } from '@/canvas/entities/BaseEntity'

const BACKGROUND_COLOR: string = '#FFF'
const WAVE_COLOR_TOP: string = '#679ebf'
const WAVE_COLOR_BOTTOM: string = '#FFF'
const WAVE_WIDTH: number = 300
const WAVE_HEIGHT: number = 30

export class WaveEntity extends BaseEntity {
  constructor({
    x,
    y,
    width,
    height,
    xVelocity,
    yVelocity,
  }: {
    x: number
    y: number
    width: number
    height: number
    xVelocity: number
    yVelocity: number
  }) {
    super({ x, y, width, height, xVelocity, yVelocity })
  }

  update(): void {
    super.update()

    // Reset position if it goes beyond full wave width.
    if (Math.abs(this.x) >= WAVE_WIDTH*2) {
      this.x = 0
    }
  }

  public render(): void {
    this.context.fillStyle = BACKGROUND_COLOR
    this.context.fillRect(0, 0, this.frameWidth, this.frameHeight)

    const gradient = this.context.createLinearGradient(0, this.frameHeight/2, 0, this.frameHeight)
    gradient.addColorStop(0, WAVE_COLOR_TOP)
    gradient.addColorStop(1, WAVE_COLOR_BOTTOM)

    this.context.fillStyle = gradient
    
    this.context.beginPath()
    this.context.moveTo(0, this.frameHeight/2)
    
    const waveIterationCount: number = Math.ceil(this.frameWidth / (WAVE_WIDTH*2)) + 2 // Plus two for start and end buffer.

    // Draw cyclical wave.
    for (let i=-1; i<waveIterationCount; i++) {
      this.context.bezierCurveTo(
        (WAVE_WIDTH*i*2)+(WAVE_WIDTH/2)+this.x,
        (this.frameHeight/2),
        (WAVE_WIDTH*i*2)+(WAVE_WIDTH/2)+this.x,
        (this.frameHeight/2)+WAVE_HEIGHT,
        (WAVE_WIDTH*i*2)+WAVE_WIDTH+this.x,
        (this.frameHeight/2)+WAVE_HEIGHT
      )
      this.context.bezierCurveTo(
        (WAVE_WIDTH*i*2)+WAVE_WIDTH+(WAVE_WIDTH/2)+this.x,
        (this.frameHeight/2)+WAVE_HEIGHT,
        (WAVE_WIDTH*i*2)+WAVE_WIDTH+(WAVE_WIDTH/2)+this.x,
        (this.frameHeight/2),
        (WAVE_WIDTH*i*2)+(WAVE_WIDTH*2)+this.x,
        (this.frameHeight/2)
      )
    }
    this.context.lineTo(this.frameWidth, this.frameHeight)
    this.context.lineTo(0, this.frameHeight)
    this.context.closePath()
    this.context.fill()
  }
}