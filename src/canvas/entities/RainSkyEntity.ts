import { RainParticleEntity } from '@/canvas/entities/RainParticleEntity'
import { AbstractEntity } from '@/canvas/entities/AbstractEntity'
import { EntityEventType } from '@/canvas/enums/EntityEventType'
import { ParticleFactory } from '@/canvas/factories/ParticleFactory'
import { ParticleFactoryEnterType } from '@/canvas/enums/ParticleFactoryEnterType'
import { BoxSideType } from '@/canvas/enums/BoxSideType'

const SKY_PARTICLE_COUNT: number = 100
const MIN_PARTICLE_VELOCITY: number = 15
const MAX_PARTICLE_VELOCITY: number = 20
const MIN_PARTICLE_SIZE: number = 30
const MAX_PARTICLE_SIZE: number = 50

/**
 * RainSkyEntity class which handles the rain particle entities.
 */
export class RainSkyEntity extends AbstractEntity {
  public readonly name: string = 'rain-sky'
  private _particleFactory: ParticleFactory

  constructor(params) {
    super(params)

    // Bind class event listeners.
    this._handleParticleExit = this._handleParticleExit.bind(this)

    // Create a new particle factory.
    this._particleFactory = new ParticleFactory({
      parentEntity: this,
      createOptions: {
        entityClass: RainParticleEntity,
        sizeRange: {
          min: MIN_PARTICLE_SIZE,
          max: MAX_PARTICLE_SIZE,
        },
        velocityVectorRange: {
          minXVelocity: 0,
          maxXVelocity: 0,
          minYVelocity: MIN_PARTICLE_VELOCITY,
          maxYVelocity: MAX_PARTICLE_VELOCITY,
          minRotationVelocity: 0,
          maxRotationVelocity: 0,
        },
        edgeEntryVectors: [
          {
            side: BoxSideType.Top,
            minXVelocity: 0,
            maxXVelocity: 0,
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
