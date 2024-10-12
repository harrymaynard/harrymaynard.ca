import { BaseEntity } from '@/canvas/entities/BaseEntity'

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
      this.x < 0 ||
      this.x > this.frameWidth ||
      this.y < 0 ||
      this.y > this.frameHeight
    ) {
      this.dispatchEvent(new Event('exit-frame'))
    }
  }

  public render(): void {
    // TODO: Draw filled circle.
    this.context.fillStyle = '#000'
    this.context.beginPath()
    this.context.arc(this.x, this.y, 50, 0, Math.PI * 2)
    this.context.fill()
  }
}
