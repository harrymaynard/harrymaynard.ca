import { type IEnterRangeVector } from '@/canvas/interfaces/IEnterRangeVector'
import { type IMinMax } from '@/canvas/interfaces/IMinMax'
import { type IVelocityVectorRange } from '@/canvas/interfaces/IVelocityVectorRange'
import { IDimensions } from './IDimensions'

export interface IParticleFactoryCreateOptions {
  entityClass: any
  size?: IDimensions
  sizeRange?: IMinMax
  velocityVectorRange: IVelocityVectorRange
  edgeEntryVectors?: Array<IEnterRangeVector>
  enterListener?: (entity: any) => void
  exitListener?: (entity: any) => void
}
