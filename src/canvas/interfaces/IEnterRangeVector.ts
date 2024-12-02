import { type BoxSideType } from '@/canvas/enums/BoxSideType'
import { type IRangeVector } from '@/canvas/interfaces/IRangeVector'

export interface IEnterRangeVector extends IRangeVector {
  side: BoxSideType
}
