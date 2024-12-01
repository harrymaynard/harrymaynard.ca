import { AbstractEntity } from '@/canvas/entities/AbstractEntity'

const PARTICLE_COLOR: string = '#CCC'

export class ParticleEntity extends AbstractEntity {
  public draw(): void {
    const radius: number = this.position.width / 2

    this.context.fillStyle = PARTICLE_COLOR
    this.context.beginPath()
    this.context.arc(
      this.position.x + radius,
      this.position.y + radius,
      radius,
      0,
      Math.PI * 2
    )
    this.context.fill()
  }
}
