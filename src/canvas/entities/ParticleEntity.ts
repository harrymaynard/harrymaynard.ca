import { BaseEntity } from '@/canvas/entities/BaseEntity'

const PARTICLE_COLOR: string = '#CCC'

export class ParticleEntity extends BaseEntity {
  constructor({
    context,
    x,
    y,
    width,
    height,
    xVelocity,
    yVelocity,
  }: {
    context: CanvasRenderingContext2D
    x: number
    y: number
    width: number
    height: number
    xVelocity: number
    yVelocity: number
  }) {
    super({
      context,
      x,
      y,
      width,
      height,
      xVelocity,
      yVelocity
    })
  }

  update(): void {
    super.update()

    // Emit the 'exit-frame' event if entity is out of view.
    if (
      this.x < -this.width ||
      this.x > this.viewportWidth ||
      this.y < -this.height ||
      this.y - this.height / 2 > this.viewportHeight
    ) {
      this.dispatchEvent(new Event('exit-frame'))
    }
  }

  public render(): void {
    if (!this.isRenderContextValid()) return

    const radius: number = this.width / 2

    this.context.fillStyle = PARTICLE_COLOR
    this.context.beginPath()
    this.context.arc(this.x + radius, this.y + radius, radius, 0, Math.PI * 2)
    this.context.fill()
  }
}
