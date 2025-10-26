import 'reflect-metadata'

const DEFAULT_GLOW_SIZE: number = 10
const DEFAULT_GLOW_COLOR: string = 'rgba(0, 0, 0, 0.5)'

export function DrawGlow(
  options?: {
    glowSize?: number,
    glowColor?: string,
  },
) {
  const glowSize = options?.glowSize ?? DEFAULT_GLOW_SIZE
  const glowColor = options?.glowColor ?? DEFAULT_GLOW_COLOR
  
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value

    descriptor.value = function (...args: any[]) {
      // target._setGlowStyle()
      // Set shadow properties for the glow effect
      // @ts-expect-error: Accessing context from parent class
      this.context.shadowColor = glowColor // Color of the glow
      // @ts-expect-error: Accessing context from parent class
      this.context.shadowBlur = glowSize // Blur radius of the glow
      // @ts-expect-error: Accessing context from parent class
      this.context.shadowOffsetX = 0 // Horizontal offset of the shadow
      // @ts-expect-error: Accessing context from parent class
      this.context.shadowOffsetY = 0 // Vertical offset of the shadow

      // debugger
      // // @ts-expect-error: Accessing context from parent class
      // if (this.assetKey && target) {
      //   // @ts-expect-error: Accessing context from parent class
      //   const xmlString = target.constructor.assets.get(this.assetKey) as string
      //   const parser = new DOMParser()
      //   const xmlDoc = parser.parseFromString(xmlString, "application/xml")
      //   console.log(xmlDoc)
      // }
      
      const result = originalMethod.apply(this, args)
      
      // @ts-expect-error: Accessing context from parent class
      this.context.shadowColor = ''
      // @ts-expect-error: Accessing context from parent class
      this.context.shadowBlur = 0
      // @ts-expect-error: Accessing context from parent class
      this.context.shadowOffsetX = 0
      // @ts-expect-error: Accessing context from parent class
      this.context.shadowOffsetY = 0
      
      return result
    }

    return descriptor
  }
}