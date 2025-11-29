import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { AbstractEntity } from '@/canvas/entities/AbstractEntity'
import { EntityEventType } from '@/canvas/enums/EntityEventType'
import { Transition } from '@/canvas/transitions/Transition'
import { type IBoundingBox } from '@/canvas/interfaces/IBoundingBox'

// Concrete implementation for testing the abstract class
class TestEntity extends AbstractEntity {
  public name: string = 'TestEntity'
  public drawCalled: boolean = false

  public draw(): void {
    this.drawCalled = true
  }
}

// Helper function to create a mock canvas context
function createMockContext(): CanvasRenderingContext2D {
  return {} as CanvasRenderingContext2D
}

// Helper function to create a default position bounding box
function createPosition(overrides: Partial<IBoundingBox> = {}): IBoundingBox {
  return {
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    ...overrides
  }
}

// Helper function to create a default viewport bounding box
function createViewport(overrides: Partial<IBoundingBox> = {}): IBoundingBox {
  return {
    x: 0,
    y: 0,
    width: 800,
    height: 600,
    ...overrides
  }
}

describe('AbstractEntity', () => {
  let context: CanvasRenderingContext2D
  let entity: TestEntity

  beforeEach(() => {
    context = createMockContext()
    entity = new TestEntity({
      context,
      position: createPosition(),
      viewport: createViewport()
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('constructor', () => {
    it('should initialize with required parameters', () => {
      const position = createPosition({ x: 10, y: 20 })
      const testEntity = new TestEntity({
        context,
        position
      })

      expect(testEntity.context).toBe(context)
      expect(testEntity.position).toBe(position)
      expect(testEntity.xVelocity).toBe(0)
      expect(testEntity.yVelocity).toBe(0)
      expect(testEntity.rotationVelocity).toBe(0)
    })

    it('should initialize with optional parameters', () => {
      const position = createPosition()
      const viewport = createViewport()
      const testEntity = new TestEntity({
        context,
        position,
        viewport,
        xVelocity: 5,
        yVelocity: 10,
        rotationVelocity: 0.5
      })

      expect(testEntity.viewport).toBe(viewport)
      expect(testEntity.xVelocity).toBe(5)
      expect(testEntity.yVelocity).toBe(10)
      expect(testEntity.rotationVelocity).toBe(0.5)
    })

    it('should set rotation to 0 if not provided in position', () => {
      const position = { x: 0, y: 0, width: 100, height: 100 }
      const testEntity = new TestEntity({
        context,
        position
      })

      expect(testEntity.position.rotation).toBe(0)
    })

    it('should preserve existing rotation in position', () => {
      const position = createPosition({ rotation: 45 })
      const testEntity = new TestEntity({
        context,
        position
      })

      expect(testEntity.position.rotation).toBe(45)
    })
  })

  describe('destroy', () => {
    it('should remove all event listeners', () => {
      const listener = vi.fn()
      entity.addEventListener(EntityEventType.EnterFrame, listener)
      
      entity.destroy()
      entity.dispatchEvent(new Event(EntityEventType.EnterFrame))
      
      expect(listener).not.toHaveBeenCalled()
    })

    it('should destroy all child entities', () => {
      const childEntity = new TestEntity({
        context,
        position: createPosition()
      })
      const destroySpy = vi.spyOn(childEntity, 'destroy')
      
      entity.addChild('children', childEntity)
      entity.destroy()
      
      expect(destroySpy).toHaveBeenCalled()
    })
  })

  describe('render', () => {
    it('should not call draw when entity is not visible', () => {
      // Entity outside viewport
      entity.position = createPosition({ x: -200, width: 50 })
      entity.update() // Update visibility status
      entity.drawCalled = false
      
      entity.render()
      
      expect(entity.drawCalled).toBe(false)
    })

    it('should call draw when entity is visible', () => {
      // Entity inside viewport
      entity.position = createPosition({ x: 100, y: 100 })
      entity.update() // Update visibility status
      entity.drawCalled = false
      
      entity.render()
      
      expect(entity.drawCalled).toBe(true)
    })

    it('should render child entities when visible', () => {
      const childEntity = new TestEntity({
        context,
        position: createPosition({ x: 100, y: 100 }),
        viewport: createViewport()
      })
      
      entity.position = createPosition({ x: 100, y: 100 })
      entity.addChild('children', childEntity)
      entity.update() // Update visibility
      childEntity.update() // Update child visibility
      childEntity.drawCalled = false
      
      entity.render()
      
      expect(childEntity.drawCalled).toBe(true)
    })
  })

  describe('update', () => {
    it('should update position based on velocity', () => {
      entity.xVelocity = 5
      entity.yVelocity = 10
      entity.position = createPosition({ x: 0, y: 0 })
      
      entity.update()
      
      expect(entity.position.x).toBe(5)
      expect(entity.position.y).toBe(10)
    })

    it('should update rotation based on rotation velocity', () => {
      entity.rotationVelocity = 2
      entity.position = createPosition({ rotation: 10 })
      
      entity.update()
      
      expect(entity.position.rotation).toBe(12)
    })

    it('should preserve rotation when rotation velocity is 0', () => {
      entity.rotationVelocity = 0
      entity.position = createPosition({ rotation: 45 })
      
      entity.update()
      
      expect(entity.position.rotation).toBe(45)
    })

    it('should dispatch EnterFrame event when entity enters viewport', () => {
      const listener = vi.fn()
      entity.addEventListener(EntityEventType.EnterFrame, listener)
      
      // Start outside viewport
      entity.position = createPosition({ x: -200, width: 50 })
      entity.update()
      
      // Move into viewport
      entity.position = createPosition({ x: 100, y: 100 })
      entity.update()
      
      expect(listener).toHaveBeenCalledTimes(1)
    })

    it('should dispatch ExitFrame event when entity exits viewport', () => {
      const listener = vi.fn()
      entity.addEventListener(EntityEventType.ExitFrame, listener)
      
      // Start inside viewport
      entity.position = createPosition({ x: 100, y: 100 })
      entity.update()
      
      // Move outside viewport
      entity.position = createPosition({ x: -200, width: 50 })
      entity.update()
      
      expect(listener).toHaveBeenCalledTimes(1)
    })

    it('should update child entities', () => {
      const childEntity = new TestEntity({
        context,
        position: createPosition({ x: 0, y: 0 }),
        viewport: createViewport()
      })
      childEntity.xVelocity = 3
      
      entity.addChild('children', childEntity)
      entity.update()
      
      expect(childEntity.position.x).toBe(3)
    })
  })

  describe('addChild', () => {
    it('should add a child entity to the specified key', () => {
      const childEntity = new TestEntity({
        context,
        position: createPosition()
      })
      
      entity.addChild('children', childEntity)
      
      expect(entity.getChildByKey('children')).toContain(childEntity)
    })

    it('should create a new array for a new key', () => {
      const childEntity = new TestEntity({
        context,
        position: createPosition()
      })
      
      entity.addChild('newKey', childEntity)
      
      expect(entity.entities.has('newKey')).toBe(true)
      expect(entity.getChildByKey('newKey')).toHaveLength(1)
    })

    it('should set frame size on child entity when parent has frame size', () => {
      entity.frameWidth = 1920
      entity.frameHeight = 1080
      
      const childEntity = new TestEntity({
        context,
        position: createPosition()
      })
      
      entity.addChild('children', childEntity)
      
      expect(childEntity.frameWidth).toBe(1920)
      expect(childEntity.frameHeight).toBe(1080)
    })

    it('should add multiple children to the same key', () => {
      const child1 = new TestEntity({
        context,
        position: createPosition()
      })
      const child2 = new TestEntity({
        context,
        position: createPosition()
      })
      
      entity.addChild('children', child1)
      entity.addChild('children', child2)
      
      expect(entity.getChildByKey('children')).toHaveLength(2)
    })
  })

  describe('removeChild', () => {
    it('should remove a child entity from the specified key', () => {
      const childEntity = new TestEntity({
        context,
        position: createPosition()
      })
      
      entity.addChild('children', childEntity)
      entity.removeChild('children', childEntity)
      
      expect(entity.getChildByKey('children')).not.toContain(childEntity)
    })

    it('should not throw error when removing from non-existent key', () => {
      const childEntity = new TestEntity({
        context,
        position: createPosition()
      })
      
      expect(() => {
        entity.removeChild('nonExistent', childEntity)
      }).not.toThrow()
    })

    it('should not remove other children when removing one', () => {
      const child1 = new TestEntity({
        context,
        position: createPosition()
      })
      const child2 = new TestEntity({
        context,
        position: createPosition()
      })
      
      entity.addChild('children', child1)
      entity.addChild('children', child2)
      entity.removeChild('children', child1)
      
      expect(entity.getChildByKey('children')).toContain(child2)
      expect(entity.getChildByKey('children')).toHaveLength(1)
    })
  })

  describe('getChildByKey', () => {
    it('should return empty array for non-existent key', () => {
      expect(entity.getChildByKey('nonExistent')).toEqual([])
    })

    it('should return child entities for existing key', () => {
      const childEntity = new TestEntity({
        context,
        position: createPosition()
      })
      
      entity.addChild('children', childEntity)
      
      expect(entity.getChildByKey('children')).toContain(childEntity)
    })
  })

  describe('resize', () => {
    it('should update position when provided', () => {
      const newPosition = createPosition({ x: 50, y: 50 })
      
      entity.resize({ position: newPosition })
      
      expect(entity.position).toBe(newPosition)
    })

    it('should update viewport when provided', () => {
      const newViewport = createViewport({ width: 1920, height: 1080 })
      
      entity.resize({ viewport: newViewport })
      
      expect(entity.viewport).toBe(newViewport)
    })

    it('should keep existing position when not provided', () => {
      const originalPosition = entity.position
      
      entity.resize({})
      
      expect(entity.position).toBe(originalPosition)
    })

    it('should keep existing viewport when not provided', () => {
      const originalViewport = entity.viewport
      
      entity.resize({})
      
      expect(entity.viewport).toBe(originalViewport)
    })
  })

  describe('setX', () => {
    it('should set the x position', () => {
      entity.setX(100)
      
      expect(entity.position.x).toBe(100)
    })
  })

  describe('setY', () => {
    it('should set the y position', () => {
      entity.setY(200)
      
      expect(entity.position.y).toBe(200)
    })
  })

  describe('setWidth', () => {
    it('should set the width', () => {
      entity.setWidth(300)
      
      expect(entity.position.width).toBe(300)
    })
  })

  describe('setHeight', () => {
    it('should set the height', () => {
      entity.setHeight(400)
      
      expect(entity.position.height).toBe(400)
    })
  })

  describe('setXVelocity', () => {
    it('should set the x velocity', () => {
      entity.setXVelocity(15)
      
      expect(entity.xVelocity).toBe(15)
    })
  })

  describe('setYVelocity', () => {
    it('should set the y velocity', () => {
      entity.setYVelocity(25)
      
      expect(entity.yVelocity).toBe(25)
    })
  })

  describe('setTransition', () => {
    it('should set the transition without throwing', () => {
      vi.stubGlobal('performance', { now: () => 0 })
      vi.stubGlobal('requestAnimationFrame', vi.fn())
      
      const transition = new Transition({
        startValue: 0,
        endValue: 100,
        duration: 1000
      })
      
      expect(() => entity.setTransition(transition)).not.toThrow()
      
      transition.destroy()
    })
  })

  describe('setRenderContext', () => {
    it('should set the context', () => {
      const newContext = createMockContext()
      
      entity.setRenderContext(newContext)
      
      expect(entity.context).toBe(newContext)
    })

    it('should set context on child entities', () => {
      const childEntity = new TestEntity({
        context,
        position: createPosition()
      })
      const newContext = createMockContext()
      
      entity.addChild('children', childEntity)
      entity.setRenderContext(newContext)
      
      expect(childEntity.context).toBe(newContext)
    })
  })

  describe('setFrameSize', () => {
    it('should set the frame width and height', () => {
      entity.setFrameSize(1920, 1080)
      
      expect(entity.frameWidth).toBe(1920)
      expect(entity.frameHeight).toBe(1080)
    })

    it('should propagate frame size to child entities', () => {
      const childEntity = new TestEntity({
        context,
        position: createPosition()
      })
      
      entity.addChild('children', childEntity)
      entity.setFrameSize(1920, 1080)
      
      expect(childEntity.frameWidth).toBe(1920)
      expect(childEntity.frameHeight).toBe(1080)
    })
  })

  describe('setViewport', () => {
    it('should set the viewport', () => {
      const newViewport = createViewport({ x: 10, y: 20, width: 1000, height: 800 })
      
      entity.setViewport(newViewport)
      
      expect(entity.viewport).toBe(newViewport)
    })
  })

  describe('isRenderContextValid', () => {
    it('should return false when context is not set', () => {
      const testEntity = new TestEntity({
        context: null as unknown as CanvasRenderingContext2D,
        position: createPosition()
      })
      testEntity.frameWidth = 100
      testEntity.frameHeight = 100
      
      expect(testEntity.isRenderContextValid()).toBe(false)
    })

    it('should return false when frameWidth is 0', () => {
      entity.frameWidth = 0
      entity.frameHeight = 100
      
      expect(entity.isRenderContextValid()).toBe(false)
    })

    it('should return false when frameHeight is 0', () => {
      entity.frameWidth = 100
      entity.frameHeight = 0
      
      expect(entity.isRenderContextValid()).toBe(false)
    })

    it('should return true when context and frame dimensions are set', () => {
      entity.frameWidth = 100
      entity.frameHeight = 100
      
      expect(entity.isRenderContextValid()).toBe(true)
    })
  })

  describe('isWithinViewport', () => {
    it('should return true when entity is fully inside viewport', () => {
      entity.position = createPosition({ x: 100, y: 100, width: 50, height: 50 })
      entity.viewport = createViewport({ x: 0, y: 0, width: 800, height: 600 })
      
      expect(entity.isWithinViewport()).toBe(true)
    })

    it('should return true when entity partially overlaps viewport from left', () => {
      entity.position = createPosition({ x: -50, y: 100, width: 100, height: 50 })
      entity.viewport = createViewport({ x: 0, y: 0, width: 800, height: 600 })
      
      expect(entity.isWithinViewport()).toBe(true)
    })

    it('should return true when entity partially overlaps viewport from top', () => {
      entity.position = createPosition({ x: 100, y: -50, width: 100, height: 100 })
      entity.viewport = createViewport({ x: 0, y: 0, width: 800, height: 600 })
      
      expect(entity.isWithinViewport()).toBe(true)
    })

    it('should return false when entity is completely left of viewport', () => {
      entity.position = createPosition({ x: -200, y: 100, width: 50, height: 50 })
      entity.viewport = createViewport({ x: 0, y: 0, width: 800, height: 600 })
      
      expect(entity.isWithinViewport()).toBe(false)
    })

    it('should return false when entity is completely right of viewport', () => {
      entity.position = createPosition({ x: 900, y: 100, width: 50, height: 50 })
      entity.viewport = createViewport({ x: 0, y: 0, width: 800, height: 600 })
      
      expect(entity.isWithinViewport()).toBe(false)
    })

    it('should return false when entity is completely above viewport', () => {
      entity.position = createPosition({ x: 100, y: -200, width: 50, height: 50 })
      entity.viewport = createViewport({ x: 0, y: 0, width: 800, height: 600 })
      
      expect(entity.isWithinViewport()).toBe(false)
    })

    it('should return false when entity is completely below viewport', () => {
      entity.position = createPosition({ x: 100, y: 700, width: 50, height: 50 })
      entity.viewport = createViewport({ x: 0, y: 0, width: 800, height: 600 })
      
      expect(entity.isWithinViewport()).toBe(false)
    })

    it('should return true when entity touches viewport edge', () => {
      entity.position = createPosition({ x: 800, y: 100, width: 50, height: 50 })
      entity.viewport = createViewport({ x: 0, y: 0, width: 850, height: 600 })
      
      expect(entity.isWithinViewport()).toBe(true)
    })
  })

  describe('entities map', () => {
    it('should initialize with empty entities map', () => {
      expect(entity.entities.size).toBe(0)
    })
  })
})
