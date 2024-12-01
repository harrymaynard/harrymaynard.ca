<script lang="ts" setup>
import { onMounted, onBeforeUnmount, ref, type Ref } from 'vue'
import { RenderEngine } from '@/canvas/RenderEngine'
import { BackgroundEntity } from '@/canvas/entities/BackgroundEntity'
import { WaveEntity } from '@/canvas/entities/WaveEntity'
import { SkyEntity } from '@/canvas/entities/SkyEntity'

let isComponentMounted: boolean = false
let ctx: CanvasRenderingContext2D
const backgroundCanvasEl = ref<HTMLCanvasElement>() as Ref<HTMLCanvasElement>
let renderEngine: RenderEngine

onMounted(() => {
  ctx = backgroundCanvasEl.value.getContext('2d') as CanvasRenderingContext2D

  // Initialize render engine and wave entity.
  renderEngine = new RenderEngine()
  renderEngine.setRenderContext(ctx)
  renderEngine.setFrameSize(
    document.body.clientWidth,
    document.body.clientHeight
  )

  // Background entity.
  renderEngine.addEntity(new BackgroundEntity({
    context: ctx,
    x: 0,
    y: 0,
    width: document.body.clientWidth,
    height: document.body.clientHeight
  }))

  // Sky entity.
  const skyEntity = new SkyEntity({
    context: ctx,
    x: 0,
    y: 0,
    width: document.body.clientWidth,
    height: (document.body.clientHeight / 2) + 30, // 30 for wave height.
  })
  skyEntity.generateEntities()
  renderEngine.addEntity(skyEntity)
  
  // Wave entity.
  renderEngine.addEntity(new WaveEntity({
    context: ctx,
    x: 0,
    y: document.body.clientHeight / 2,
    width: document.body.clientWidth,
    height: document.body.clientHeight,
    xVelocity: -1,
  }))

  setCanvasSize()
  window.addEventListener('resize', setCanvasSize)

  isComponentMounted = true

  // Start render loop.
  window.requestAnimationFrame(handleNextFrame)
})

onBeforeUnmount(() => {
  isComponentMounted = false
  window.removeEventListener('resize', setCanvasSize)
})

// Set canvas size, and scale according to pixel density.
const setCanvasSize = () => {
  // Set frame size after resize.
  renderEngine.setFrameSize(
    document.body.clientWidth,
    document.body.clientHeight
  )

  // Set display size (css pixels).
  backgroundCanvasEl.value.style.width = `${document.body.clientWidth}px`
  backgroundCanvasEl.value.style.height = `${document.body.clientHeight}px`

  // Set actual size in memory (scaled to account for extra pixel density).
  const scale = window.devicePixelRatio // Change to 1 on retina screens to see blurry backgroundCanvasEl.
  backgroundCanvasEl.value.width = Math.floor(document.body.clientWidth * scale)
  backgroundCanvasEl.value.height = Math.floor(document.body.clientHeight * scale)

  // Normalize coordinate system to use CSS pixels.
  ctx.scale(scale, scale)
}

const handleNextFrame = () => {
  // Exit render loop if component is unmounted.
  if (!isComponentMounted) return

  // Update entities and render frame.
  renderEngine.update()
  renderEngine.render()
  
  // Request next animation frame.
  window.requestAnimationFrame(handleNextFrame)
}
</script>

<template>
  <div class="animated-background">
    <canvas
      id="background-canvas"
      ref="backgroundCanvasEl"
    ></canvas>
  </div>
</template>

<style lang="scss" scoped>
.animated-background {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: -1;
  background: #FFF;
}
</style>
