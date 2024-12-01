import { BaseEntity } from '@/canvas/entities/BaseEntity'

const PARTICLE_COLOR: string = '#CCC'

export class ParticleEntity extends BaseEntity {
  public render(): void {
    const radius: number = this.width / 2

    this.context.fillStyle = PARTICLE_COLOR
    this.context.beginPath()
    this.context.arc(this.x + radius, this.y + radius, radius, 0, Math.PI * 2)
    this.context.fill()
  }
}
