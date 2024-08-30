<script lang="ts" setup>
import { onMounted, onBeforeUnmount, ref, type Ref } from 'vue'

const BACKGROUND_COLOR: string = '#FFF'
const WAVE_COLOR_TOP: string = '#679ebf'
const WAVE_COLOR_BOTTOM: string = '#FFF'
const WAVE_WIDTH: number = 300
const WAVE_HEIGHT: number = 30

let isComponentMounted: boolean = false
let ctx: CanvasRenderingContext2D
let waveXPosition: number = 0
const backgroundCanvasEl = ref<HTMLCanvasElement>() as Ref<HTMLCanvasElement>

onMounted(() => {
  ctx = backgroundCanvasEl.value.getContext('2d') as CanvasRenderingContext2D
  
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

  const frameWidth: number = document.body.clientWidth
  const frameHeight: number = document.body.clientHeight

  const waveIterationCount: number = Math.ceil(frameWidth / (WAVE_WIDTH*2)) + 2 // Plus two for start and end buffer.

  ctx.fillStyle = BACKGROUND_COLOR
  ctx.fillRect(0, 0, frameWidth, frameHeight)

  const gradient = ctx.createLinearGradient(0, frameHeight/2, 0, frameHeight)
  gradient.addColorStop(0, WAVE_COLOR_TOP)
  gradient.addColorStop(1, WAVE_COLOR_BOTTOM)

  ctx.fillStyle = gradient
  
  ctx.beginPath()
  ctx.moveTo(0, frameHeight/2)
  
  // Draw cyclical wave.
  for (let i=-1; i<waveIterationCount; i++) {
    ctx.bezierCurveTo(
      (WAVE_WIDTH*i*2)+(WAVE_WIDTH/2)+waveXPosition,
      (frameHeight/2),
      (WAVE_WIDTH*i*2)+(WAVE_WIDTH/2)+waveXPosition,
      (frameHeight/2)+WAVE_HEIGHT,
      (WAVE_WIDTH*i*2)+WAVE_WIDTH+waveXPosition,
      (frameHeight/2)+WAVE_HEIGHT
    )
    ctx.bezierCurveTo(
      (WAVE_WIDTH*i*2)+WAVE_WIDTH+(WAVE_WIDTH/2)+waveXPosition,
      (frameHeight/2)+WAVE_HEIGHT,
      (WAVE_WIDTH*i*2)+WAVE_WIDTH+(WAVE_WIDTH/2)+waveXPosition,
      (frameHeight/2),
      (WAVE_WIDTH*i*2)+(WAVE_WIDTH*2)+waveXPosition,
      (frameHeight/2)
    )
  }
  ctx.lineTo(frameWidth, frameHeight)
  ctx.lineTo(0, frameHeight)
  ctx.closePath()
  ctx.fill()
  
  // Animate wave to the left. Reset position if it goes beyond full wave width.
  if (Math.abs(waveXPosition) >= WAVE_WIDTH*2) {
    waveXPosition = 0
  } else {
    waveXPosition--
  }

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
