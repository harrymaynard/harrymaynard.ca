import { type BoxSideType } from '@/canvas/enums/BoxSideType'
import { type IVelocityVectorRange } from '@/canvas/interfaces/IVelocityVectorRange'

export interface IEnterRangeVector extends IVelocityVectorRange {
  side: BoxSideType
}
