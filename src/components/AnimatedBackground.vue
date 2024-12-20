<script lang="ts" setup>
import { onMounted, onBeforeUnmount, ref, type Ref } from 'vue'
import { RootEntity } from '@/canvas/entities/RootEntity'

const backgroundCanvasEl = ref<HTMLCanvasElement>() as Ref<HTMLCanvasElement>

let isComponentMounted: boolean = false
let context: CanvasRenderingContext2D
let rootEntity: RootEntity

onMounted(() => {
  context = backgroundCanvasEl.value.getContext('2d') as CanvasRenderingContext2D
  
  // Root entity that contains all other nested entities.
  rootEntity = new RootEntity({
    context,
    position: {
      x: 0,
      y: 0,
      width: document.body.clientWidth,
      height: document.body.clientHeight,
    },
  })

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

/**
 * Set canvas size and scale according to pixel density.
 */
const setCanvasSize = () => {
  // Set frame size after resize.
  rootEntity.setFrameSize(
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
  context.scale(scale, scale)
}

/**
 * Render loop that updates entities and renders frame.
 */
const handleNextFrame = () => {
  // Exit render loop if component is unmounted.
  if (!isComponentMounted) return

  // Update entities and render frame.
  rootEntity.update()
  rootEntity.render()
  
  // Request next animation frame.
  window.requestAnimationFrame(handleNextFrame)
}
</script>

<template>
  <div class="animated-background">
    <canvas
      id="background-canvas"
      ref="backgroundCanvasEl"
    />
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
