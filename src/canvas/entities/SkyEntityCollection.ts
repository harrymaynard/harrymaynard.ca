import { BaseEntityCollection } from '@/canvas/entities/BaseEntityCollection'
import { ParticleEntity } from '@/canvas/entities/ParticleEntity'
import { BaseEntity } from '@/canvas/entities/BaseEntity'

const SKY_PARTICLE_COUNT: number = 100
const MIN_PARTICLE_VELOCITY: number = 0.1
const MAX_PARTICLE_VELOCITY: number = 0.5
const MIN_PARTICLE_SIZE: number = 5
const MAX_PARTICLE_SIZE: number = 10

enum SkyEntryAxisType {
  X = 0,
  Y = 1,
}

export class SkyEntityCollection extends BaseEntityCollection {

  constructor(params) {
    super(params)

    // Bind class event listeners.
    this.handleParticleExit = this.handleParticleExit.bind(this)
  }

  public generateEntities(): void {
    // Create ParticleEntity instances.
    for (let i=0; i<SKY_PARTICLE_COUNT; i++) {
      this.generateEntity(false)
    }
  }

  public generateEntity(isOffScreen: boolean = true): void {
    const xVelocity: number = -(this.getRandomVelocity())
    const yVelocity: number = this.getRandomVelocity()
    const entitySize: number = this.getRandomEntitySize()
    let x: number
    let y: number

    if (isOffScreen) {
      const entryAxisTotalLength: number = this.width + this.height
      const entryAxisPosition: number = Math.floor(Math.random() * entryAxisTotalLength)
      const startingAxis: number
        = entryAxisTotalLength - entryAxisPosition < this.width
          ? SkyEntryAxisType.X
          : SkyEntryAxisType.Y

      // X-axis entry.
      if (startingAxis === SkyEntryAxisType.X) {
        x = (Math.random() * this.width) - entitySize
        y = -entitySize
      }
      // Y-axis entry.
      else {
        x = this.width
        y = (Math.random() * this.height) - entitySize
      }
    } else {
      x = (Math.random() * this.width) - entitySize
      y = (Math.random() * this.height) - entitySize
    }

    const particle: ParticleEntity = new ParticleEntity({
      x,
      y,
      width: entitySize,
      height: entitySize,
      xVelocity,
      yVelocity,
    })
    
    particle.addEventListener('exit-frame', this.handleParticleExit)
    
    particle.setRenderContext(
      this.context,
      this.width,
      this.height
    )
    this.addEntity(particle)
  }

  public update() {
    super.update()
  }

  private handleParticleExit(event: Event): void {
    const entity: BaseEntity = event.target as BaseEntity
    
    const index = this.entities.indexOf(entity)
    if (index >= 0) {
      entity.removeEventListener('exit-frame', this.handleParticleExit)
      this.entities.splice(index, 1)
      this.generateEntity()
    }
  }

  private getRandomVelocity(): number {
    return Math.random() * (MAX_PARTICLE_VELOCITY - MIN_PARTICLE_VELOCITY) + MIN_PARTICLE_VELOCITY
  }

  private getRandomEntitySize(): number {
    return Math.floor(Math.random() * (MAX_PARTICLE_SIZE - MIN_PARTICLE_SIZE) + MIN_PARTICLE_SIZE)
  }
}