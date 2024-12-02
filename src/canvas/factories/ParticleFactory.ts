import { AbstractEntity } from '@/canvas/entities/AbstractEntity'
import { getRandomNumberInRange } from '@/canvas/helpers/NumberHelper'
import { EntityEventType } from '@/canvas/enums/EntityEventType'
import { ParticleFactoryEnterType } from '@/canvas/enums/ParticleFactoryEnterType'
import { type IParticleFactoryCreateOptions } from '@/canvas/interfaces/IParticleFactoryCreateOptions'
import { type ICoordinates } from '@/canvas/interfaces/ICoordinates'
import { BoxSideType } from '@/canvas/enums/BoxSideType'

/**
 * Particle factory class which handles the creation of particles.
 */
export class ParticleFactory {
  private _parentEntity: AbstractEntity
  private _createOptions: IParticleFactoryCreateOptions

  constructor({
    parentEntity,
    createOptions
  }: {
    parentEntity: AbstractEntity
    createOptions: IParticleFactoryCreateOptions
  }) {
    this._parentEntity = parentEntity
    this._createOptions = createOptions
  }

  /**
   * Generate initial particles for the parent entity.
   */
  public create({
    count = 1,
    enterType = ParticleFactoryEnterType.Center,
  }: {
    count?: number,
    enterType?: ParticleFactoryEnterType,
  }): void {
    for (let i = 0; i < count; i++) {
      const entitySize: number = getRandomNumberInRange(
        this._createOptions.sizeRange.min,
        this._createOptions.sizeRange.max
      )
      const xVelocity: number = getRandomNumberInRange(
        this._createOptions.velocityVectorRange.minXVelocity,
        this._createOptions.velocityVectorRange.maxXVelocity
      )
      const yVelocity: number = getRandomNumberInRange(
        this._createOptions.velocityVectorRange.minYVelocity,
        this._createOptions.velocityVectorRange.maxYVelocity
      )

      const coordinates: ICoordinates = this._getEntityStartingCoordinates(
        enterType,
        entitySize,
        entitySize
      )
      
      const particle = new this._createOptions.entityClass({
        context: this._parentEntity.context,
        position: {
          x: coordinates.x,
          y: coordinates.y,
          width: entitySize,
          height: entitySize,
        },
        viewport: {
          x: this._parentEntity.position.x,
          y: this._parentEntity.position.y,
          width: this._parentEntity.position.width,
          height: this._parentEntity.position.height,
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

  private _getEntityStartingCoordinates(
    enterType: ParticleFactoryEnterType,
    width: number,
    height: number
  ): ICoordinates {
    let x: number = 0
    let y: number = 0
    let edgeCoordinates: ICoordinates

    switch (enterType) {
      case ParticleFactoryEnterType.Center:
        x = (Math.random() * (this._parentEntity.position.width + width)) - width
        y = (Math.random() * (this._parentEntity.position.height + height)) - height
        break
      case ParticleFactoryEnterType.Edge:
        edgeCoordinates = this._getRandomEdgeCoordinates(width, height)
        x = edgeCoordinates.x
        y = edgeCoordinates.y
        break
      default:
        throw new Error('Invalid enter type.')
    }

    return {
      x,
      y,
    }
  }

  private _getRandomEdgeCoordinates(
    particleWidth: number,
    particleHeight: number
  ): ICoordinates {
    const sumOfEdges: number = this._createOptions.edgeEntryVectors
      ?.reduce((acc, vector) => {
        return acc + this._getSideLengthByType(vector.side)
      }, 0) ?? 0

    const entryAxisPosition: number = Math.floor(Math.random() * sumOfEdges)
    let x: number = 0
    let y: number = 0
    
    if (
      Array.isArray(this._createOptions.edgeEntryVectors) &&
      this._createOptions.edgeEntryVectors?.length > 0
    ) {
      let sideIndex: number = 0
      let side: BoxSideType
      let currentSideLength: number = 0

      do {
        side = this._createOptions.edgeEntryVectors[sideIndex].side
        currentSideLength += this._getSideLengthByType(side)

        if (entryAxisPosition < currentSideLength) {
          side = this._createOptions.edgeEntryVectors[sideIndex].side
          break
        }
        sideIndex++
      } while (sideIndex <= this._createOptions.edgeEntryVectors.length)

      switch (side) {
        case BoxSideType.Top:
          x = (Math.random() * this._parentEntity.position.width + particleWidth) - particleWidth
          y = -particleHeight
          break
        case BoxSideType.Right:
          x = this._parentEntity.position.width
          y = (Math.random() * this._parentEntity.position.height + particleHeight) - particleHeight
          break
        case BoxSideType.Bottom:
          x = (Math.random() * this._parentEntity.position.width + particleWidth) - particleWidth
          y = this._parentEntity.position.height
          break
        case BoxSideType.Left:
          x = -particleWidth
          y = (Math.random() * this._parentEntity.position.height + particleHeight) - particleHeight
          break
        default:
          break
      }
    }

    return {
      x,
      y,
    }
  }

  public _getSideLengthByType(side: BoxSideType): number {
    switch (side) {
      case BoxSideType.Top:
      case BoxSideType.Bottom:
        return this._parentEntity.position.width
      case BoxSideType.Left:
      case BoxSideType.Right:
        return this._parentEntity.position.height
      default:
        throw new Error('Invalid side')
    }
  }
}
