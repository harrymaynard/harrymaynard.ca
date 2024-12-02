import { SnowflakeParticleEntity } from '@/canvas/entities/SnowflakeParticleEntity'
import { AbstractEntity } from '@/canvas/entities/AbstractEntity'
import { EntityEventType } from '@/canvas/enums/EntityEventType'
import { ParticleFactory } from '@/canvas/factories/ParticleFactory'
import { ParticleFactoryEnterType } from '@/canvas/enums/ParticleFactoryEnterType'
import { BoxSideType } from '@/canvas/enums/BoxSideType'

const SKY_PARTICLE_COUNT: number = 25
const MIN_PARTICLE_VELOCITY: number = 0.1
const MAX_PARTICLE_VELOCITY: number = 0.5
const MIN_PARTICLE_SIZE: number = 20
const MAX_PARTICLE_SIZE: number = 40

/**
 * SkyEntity class which handles the sky background entities.
 */
export class SkyEntity extends AbstractEntity {
  private _particleFactory: ParticleFactory

  constructor(params) {
    super(params)

    // Bind class event listeners.
    this._handleParticleExit = this._handleParticleExit.bind(this)

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
  }

  /**
   * Generate initial entities for the sky.
   */
  public generateEntities(): void {
    this._particleFactory.create({
      count: SKY_PARTICLE_COUNT,
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
    const entity: AbstractEntity = event.target as AbstractEntity
    entity.removeEventListener(EntityEventType.ExitFrame, this._handleParticleExit)
    this.removeChild(entity)

    this._particleFactory.create({
      enterType: ParticleFactoryEnterType.Edge,
    })
  }
}