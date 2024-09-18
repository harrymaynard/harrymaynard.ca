import { BaseEntityCollection } from '@/canvas/entities/BaseEntityCollection'
import { ParticleEntity } from '@/canvas/entities/ParticleEntity'

const SKY_PARTICLE_COUNT: number = 10

export class SkyEntityCollection extends BaseEntityCollection {

  constructor(params) {
    super(params)

    // Bind class event listeners.
    this.handleParticelExit = this.handleParticelExit.bind(this)
  }

  public generateEntities(): void {
    // Create ParticleEntity instances.
    for (let i=0; i<SKY_PARTICLE_COUNT; i++) {
      const xVelocity: number = 0
      const yVelocity: number = 0

      // const particle: ParticleEntity = new ParticleEntity({
      //   x: Math.random() * this.frameWidth,
      //   y: Math.random() * this.frameHeight,
      //   width: 10,
      //   height: 10,
      //   xVelocity,
      //   yVelocity,
      // })
      const particle: ParticleEntity = new ParticleEntity({
        x: this.frameWidth,
        y: 0,
        width: 10,
        height: 10,
        xVelocity,
        yVelocity,
      })
      // TODO: Listen for 'exit-frame' event.
      // particle.on('exit-frame', this.handleParticelExit)

      particle.setRenderContext(
        this.context,
        this.frameWidth,
        this.frameHeight
      )
      this.entities.push(particle)
    }
  }

  public update() {
    super.update()
  }

  private handleParticelExit(entity: BaseEntity): void {
    const index = this.entities.indexOf(entity)
    if (index >= 0) {
      this.entities.splice(index, 1)
    }
  }
}