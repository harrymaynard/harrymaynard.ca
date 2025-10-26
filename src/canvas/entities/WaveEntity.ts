import { AbstractEntity } from '@/canvas/entities/AbstractEntity'
// import { DrawGlow } from '../decorators/GlowDecorator'

const WAVE_COLOR_TOP: string = '#679ebf'
const WAVE_COLOR_BOTTOM: string = '#FFF'
const WAVE_WIDTH: number = 300
const WAVE_HEIGHT: number = 30

/**
 * Represents a wave entity on the canvas.
 * @extends AbstractEntity
 */
export class WaveEntity extends AbstractEntity {
  public readonly name: string = 'wave'

  constructor(params) {
    super(params)
    this.setWidth(WAVE_WIDTH * 2)
  }

  /**
   * Update the entity's position.
   * @returns void
   */
  update(): void {
    super.update()

    // Reset position if it goes beyond full wave width.
    if (Math.abs(this.position.x) >= WAVE_WIDTH * 2 - 1) {
      this.position.x = 0
    }
  }

  /**
   * draw the entity on the canvas.
   * @returns void
   */
  // @DrawGlow()
  public draw(): void {
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
        (WAVE_WIDTH*i*2)+(WAVE_WIDTH/2)+this.position.x,
        (this.frameHeight/2),
        (WAVE_WIDTH*i*2)+(WAVE_WIDTH/2)+this.position.x,
        (this.frameHeight/2)+WAVE_HEIGHT,
        (WAVE_WIDTH*i*2)+WAVE_WIDTH+this.position.x,
        (this.frameHeight/2)+WAVE_HEIGHT
      )
      this.context.bezierCurveTo(
        (WAVE_WIDTH*i*2)+WAVE_WIDTH+(WAVE_WIDTH/2)+this.position.x,
        (this.frameHeight/2)+WAVE_HEIGHT,
        (WAVE_WIDTH*i*2)+WAVE_WIDTH+(WAVE_WIDTH/2)+this.position.x,
        (this.frameHeight/2),
        (WAVE_WIDTH*i*2)+(WAVE_WIDTH*2)+this.position.x,
        (this.frameHeight/2)
      )
    }
    this.context.lineTo(this.frameWidth, this.frameHeight)
    this.context.lineTo(0, this.frameHeight)
    this.context.closePath()
    this.context.fill()
  }
}