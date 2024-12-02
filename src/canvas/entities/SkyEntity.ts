import { SnowflakeParticleEntity } from '@/canvas/entities/SnowflakeParticleEntity'
import { AbstractEntity } from '@/canvas/entities/AbstractEntity'
import { EntityEventType } from '@/canvas/enums/EntityEventType'

const SKY_PARTICLE_COUNT: number = 25
const MIN_PARTICLE_VELOCITY: number = 0.1
const MAX_PARTICLE_VELOCITY: number = 0.5
const MIN_PARTICLE_SIZE: number = 20
const MAX_PARTICLE_SIZE: number = 40

enum SkyEntryAxisType {
  X = 0,
  Y = 1,
}

/**
 * SkyEntity class which handles the sky background entities.
 */
export class SkyEntity extends AbstractEntity {

  constructor(params) {
    super(params)

    // Bind class event listeners.
    this._handleParticleExit = this._handleParticleExit.bind(this)
  }

  /**
   * Generate initial entities for the sky.
   */
  public generateEntities(): void {
    // Create ParticleEntity instances.
    for (let i=0; i<SKY_PARTICLE_COUNT; i++) {
      this._generateEntity(false)
    }
  }

  /**
   * Generate a new single entity for the sky.
   * @param isOffScreen 
   */
  private _generateEntity(isOffScreen: boolean = true): void {
    const xVelocity: number = -(this._getRandomVelocity())
    const yVelocity: number = this._getRandomVelocity()
    const entitySize: number = this._getRandomEntitySize()
    let x: number
    let y: number

    if (isOffScreen) {
      const entryAxisTotalLength: number = this.position.width + this.position.height
      const entryAxisPosition: number = Math.floor(Math.random() * entryAxisTotalLength)
      const startingAxis: number
        = entryAxisTotalLength - entryAxisPosition < this.position.width
          ? SkyEntryAxisType.X
          : SkyEntryAxisType.Y

      // X-axis entry.
      if (startingAxis === SkyEntryAxisType.X) {
        x = (Math.random() * this.position.width) - entitySize
        y = -entitySize
      }
      // Y-axis entry.
      else {
        x = this.position.width
        y = (Math.random() * this.position.height) - entitySize
      }
    } else {
      x = (Math.random() * this.position.width) - entitySize
      y = (Math.random() * this.position.height) - entitySize
    }

    const particle: SnowflakeParticleEntity = new SnowflakeParticleEntity({
      context: this.context,
      position: {
        x,
        y,
        width: entitySize,
        height: entitySize,
      },
      viewport: {
        x: 0,
        y: 0,
        width: this.position.width,
        height: this.position.height,
      },
      xVelocity,
      yVelocity,
    })
    
    particle.addEventListener(EntityEventType.ExitFrame, this._handleParticleExit)
    this.addChild(particle)
  }

  /**
   * Empty draw method for the sky entity.
   */
  public draw(): void {}

  /**
   * Handle particle exit event. Removes the particle entity and generates a new one.
   * @param event 
   */
  private _handleParticleExit(event: Event): void {
    const entity: AbstractEntity = event.target as AbstractEntity
    entity.removeEventListener(EntityEventType.ExitFrame, this._handleParticleExit)
    this.removeChild(entity)
    this._generateEntity()
  }

  /**
   * Get a random velocity for the particle entity.
   * @returns number
   */
  private _getRandomVelocity(): number {
    return Math.random() * (MAX_PARTICLE_VELOCITY - MIN_PARTICLE_VELOCITY) + MIN_PARTICLE_VELOCITY
  }

  /**
   * Get a random size for the particle entity. 
   * @returns number
   */
  private _getRandomEntitySize(): number {
    return Math.floor(Math.random() * (MAX_PARTICLE_SIZE - MIN_PARTICLE_SIZE) + MIN_PARTICLE_SIZE)
  }
}