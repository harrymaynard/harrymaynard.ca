import { type IBoundingBox } from '@/canvas/interfaces/IBoundingBox'

export const createDefaultViewport = (): IBoundingBox => ({
  x: 0,
  y: 0,
  width: document.body.clientWidth,
  height: document.body.clientHeight,
})
