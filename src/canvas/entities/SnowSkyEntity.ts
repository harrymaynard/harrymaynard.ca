import { SnowflakeParticleEntity } from '@/canvas/entities/SnowflakeParticleEntity'
import { AbstractEntity } from '@/canvas/entities/AbstractEntity'
import { EntityEventType } from '@/canvas/enums/EntityEventType'
import { ParticleFactory } from '@/canvas/factories/ParticleFactory'
import { ParticleFactoryEnterType } from '@/canvas/enums/ParticleFactoryEnterType'
import { BoxSideType } from '@/canvas/enums/BoxSideType'

const SKY_PARTICLE_COUNT: number = 25
const MIN_PARTICLE_VELOCITY: number = 0.1
const MAX_PARTICLE_VELOCITY: number = 0.5
const MIN_PARTICLE_ROTATION_VELOCITY: number = -0.8
const MAX_PARTICLE_ROTATION_VELOCITY: number = 0.8
const MIN_PARTICLE_SIZE: number = 20
const MAX_PARTICLE_SIZE: number = 40

/**
 * SkyEntity class which handles the sky background entities.
 */
export class SnowSkyEntity extends AbstractEntity {
  public readonly name: string = 'snow-sky'
  private _particleFactory: ParticleFactory

  constructor(params) {
    super(params)

    // Bind class event listeners.
    this._handleParticleExit = this._handleParticleExit.bind(this)

    // Create a new particle factory.
    this._particleFactory = new ParticleFactory({
      parentEntity: this,
      createOptions: {
        entityClass: SnowflakeParticleEntity,
        sizeRange: {
          min: MIN_PARTICLE_SIZE,
          max: MAX_PARTICLE_SIZE,
        },
        velocityVectorRange: {
          minXVelocity: -MIN_PARTICLE_VELOCITY,
          maxXVelocity: -MAX_PARTICLE_VELOCITY,
          minYVelocity: MIN_PARTICLE_VELOCITY,
          maxYVelocity: MAX_PARTICLE_VELOCITY,
          minRotationVelocity: MIN_PARTICLE_ROTATION_VELOCITY,
          maxRotationVelocity: MAX_PARTICLE_ROTATION_VELOCITY,
        },
        edgeEntryVectors: [
          {
            side: BoxSideType.Top,
            minXVelocity: -MIN_PARTICLE_VELOCITY,
            maxXVelocity: -MAX_PARTICLE_VELOCITY,
            minYVelocity: MIN_PARTICLE_VELOCITY,
            maxYVelocity: MAX_PARTICLE_VELOCITY,
          },
          {
            side: BoxSideType.Right,
            minXVelocity: -MIN_PARTICLE_VELOCITY,
            maxXVelocity: -MAX_PARTICLE_VELOCITY,
            minYVelocity: MIN_PARTICLE_VELOCITY,
            maxYVelocity: MAX_PARTICLE_VELOCITY,
          },
        ],
        exitListener: this._handleParticleExit,
      }
    })

    // Create child entities.
    this._particleFactory.create({
      count: SKY_PARTICLE_COUNT,
      enterType: ParticleFactoryEnterType.Center,
    })
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
    const entity: AbstractEntity = event.target as unknown as AbstractEntity
    entity.removeEventListener(EntityEventType.ExitFrame, this._handleParticleExit)
    this.removeChild(entity.name, entity)
    this._particleFactory.create()
  }
}