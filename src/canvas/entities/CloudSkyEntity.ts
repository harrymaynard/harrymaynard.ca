import { CloudParticleEntity } from '@/canvas/entities/CloudParticleEntity'
import { AbstractEntity } from '@/canvas/entities/AbstractEntity'
import { EntityEventType } from '@/canvas/enums/EntityEventType'
import { ParticleFactory } from '@/canvas/factories/ParticleFactory'
import { ParticleFactoryEnterType } from '@/canvas/enums/ParticleFactoryEnterType'
import { BoxSideType } from '@/canvas/enums/BoxSideType'
import { EntityKeyType } from '@/canvas/enums/EntityKeyType'

const SKY_PARTICLE_COUNT: number = 20
const MIN_PARTICLE_VELOCITY: number = 0.2
const MAX_PARTICLE_VELOCITY: number = 0.7

/**
 * SkyEntity class which handles the sky background entities.
 */
export class CloudSkyEntity extends AbstractEntity {
  public readonly name: string = 'cloud-sky'
  private _particleFactory: ParticleFactory

  constructor(params) {
    super(params)

    // Bind class event listeners.
    this._handleParticleExit = this._handleParticleExit.bind(this)

    // Create a new particle factory.
    this._particleFactory = new ParticleFactory({
      parentEntity: this,
      createOptions: {
        entityClass: CloudParticleEntity,
        velocityVectorRange: {
          minXVelocity: -MIN_PARTICLE_VELOCITY,
          maxXVelocity: -MAX_PARTICLE_VELOCITY,
          minYVelocity: 0,
          maxYVelocity: 0,
          minRotationVelocity: 0,
          maxRotationVelocity: 0,
        },
        edgeEntryVectors: [
          {
            side: BoxSideType.Right,
            minXVelocity: -MIN_PARTICLE_VELOCITY,
            maxXVelocity: -MAX_PARTICLE_VELOCITY,
            minYVelocity: 0,
            maxYVelocity: 0,
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
    this.removeChild(EntityKeyType.Cloud, entity)
    this._particleFactory.create()
  }
}
