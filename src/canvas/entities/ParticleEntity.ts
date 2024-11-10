import { BaseEntity } from '@/canvas/entities/BaseEntity'

const PARTICLE_COLOR: string = '#CCC'

export class ParticleEntity extends BaseEntity {
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

    // Emit the 'exit-frame' event if entity is out of view.
    if (
      this.x < -this.width ||
      this.x > this.frameWidth ||
      this.y < -this.height ||
      this.y > this.frameHeight
    ) {
      this.dispatchEvent(new Event('exit-frame'))
    }
  }

  public render(): void {
    // TODO: Draw filled circle.
    this.context.fillStyle = PARTICLE_COLOR
    this.context.beginPath()
    this.context.arc(this.x, this.y, (this.width  / 2), 0, Math.PI * 2)
    this.context.fill()
  }
}
