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
      this.y - this.height / 2 > this.frameHeight
    ) {
      this.dispatchEvent(new Event('exit-frame'))
    }
  }

  public render(): void {
    if (!this.isRenderContextValid()) return

    const radius: number = this.width / 2

    // @ts-expect-error - TS2532: Object is possibly 'undefined'.
    this.context.fillStyle = PARTICLE_COLOR
    // @ts-expect-error - TS2532: Object is possibly 'undefined'.
    this.context.beginPath()
    // @ts-expect-error - TS2532: Object is possibly 'undefined'.
    this.context.arc(this.x + radius, this.y + radius, radius, 0, Math.PI * 2)
    // @ts-expect-error - TS2532: Object is possibly 'undefined'.
    this.context.fill()
  }
}
