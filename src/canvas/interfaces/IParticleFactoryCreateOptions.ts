import { type IEnterRangeVector } from '@/canvas/interfaces/IEnterRangeVector'
import { type IMinMax } from '@/canvas/interfaces/IMinMax'
import { type IVelocityVectorRange } from '@/canvas/interfaces/IVelocityVectorRange'

export interface IParticleFactoryCreateOptions {
  entityClass: any
  sizeRange: IMinMax
  velocityVectorRange: IVelocityVectorRange
  edgeEntryVectors?: Array<IEnterRangeVector>
  enterListener?: (entity: any) => void
  exitListener?: (entity: any) => void
}
