import { AbstractEntity } from '@/canvas/entities/AbstractEntity'
import { getRandomNumberInRange } from '@/canvas/helpers/NumberHelper'
import { EntityEventType } from '@/canvas/enums/EntityEventType'
import { type IParticleFactoryCreateOptions } from '@/canvas/interfaces/IParticleFactoryCreateOptions'
import { type IRangeVector } from '@/canvas/interfaces/IRangeVector'
import { type IMinMax } from '@/canvas/interfaces/IMinMax'

/**
 * Particle factory class which handles the creation of particles.
 */
export class ParticleFactory {
  private _parentEntity: AbstractEntity
  private _createOptions: IParticleFactoryCreateOptions | undefined

  constructor({
    parentEntity,
    createOptions
  }: {
    parentEntity: AbstractEntity
    createOptions?: IParticleFactoryCreateOptions
  }) {
    this._parentEntity = parentEntity
    this._createOptions = createOptions
  }

  /**
   * Generate initial particles for the parent entity.
   */
  public generateInitialParticles({
    entityClass,
    count,
    rangeVector,
    sizeRange
  }: {
    entityClass: any,
    count: number,
    rangeVector: IRangeVector,
    sizeRange: IMinMax
  }): void {
    for (let i = 0; i < count; i++) {
      const entitySize: number = getRandomNumberInRange(sizeRange.min, sizeRange.max)
      const xVelocity: number = getRandomNumberInRange(rangeVector.minXVelocity, rangeVector.maxXVelocity)
      const yVelocity: number = getRandomNumberInRange(rangeVector.minYVelocity, rangeVector.maxYVelocity)
      const x = (Math.random() * (this._parentEntity.position.width + entitySize)) - entitySize
      const y = (Math.random() * (this._parentEntity.position.height + entitySize)) - entitySize
      
      const particle = new entityClass({
        context: this._parentEntity.context,
        position: {
          x,
          y,
          width: entitySize,
          height: entitySize,
        },
        xVelocity,
        yVelocity,
      })

      if (this._createOptions?.enterListener) {
        particle.addEventListener(EntityEventType.EnterFrame, this._createOptions.enterListener)
      }
      if (this._createOptions?.exitListener) {
        particle.addEventListener(EntityEventType.ExitFrame, this._createOptions.exitListener)
      }
      this._parentEntity.addChild(particle)
    }
  }
}
