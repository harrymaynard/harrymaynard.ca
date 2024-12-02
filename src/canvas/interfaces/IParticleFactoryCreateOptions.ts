import { type IEnterRangeVector } from '@/canvas/interfaces/IEnterRangeVector'

export interface IParticleFactoryCreateOptions {
  enterVectors?: Array<IEnterRangeVector>
  enterListener?: (entity: any) => void
  exitListener?: (entity: any) => void
}
