<script lang="ts" setup>
import { onMounted, onBeforeUnmount } from 'vue'

let isComponentMounted: boolean = false
let canvasEl: HTMLCanvasElement
let ctx: CanvasRenderingContext2D
let waveXPosition: number = 0

onMounted(() => {
  canvasEl = document.getElementById('background-canvas') as HTMLCanvasElement
  ctx = canvasEl.getContext("2d") as CanvasRenderingContext2D

  setCanvasSize()
  window.addEventListener('resize', setCanvasSize)

  isComponentMounted = true
  window.requestAnimationFrame(handleNextFrame)
})

onBeforeUnmount(() => {
  isComponentMounted = false
  window.removeEventListener('resize', setCanvasSize)
})

const setCanvasSize = () => {
  // Set display size (css pixels).
  canvasEl.style.width = `${document.body.clientWidth}px`
  canvasEl.style.height = `${document.body.clientHeight}px`

  // Set actual size in memory (scaled to account for extra pixel density).
  const scale = window.devicePixelRatio // Change to 1 on retina screens to see blurry canvasEl.
  canvasEl.width = Math.floor(document.body.clientWidth * scale)
  canvasEl.height = Math.floor(document.body.clientHeight * scale)

  // Normalize coordinate system to use CSS pixels.
  ctx.scale(scale, scale)
}

const handleNextFrame = () => {
  if (!isComponentMounted) return

  const width = document.body.clientWidth
  const height = document.body.clientHeight

  const waveWidth: number = 300
  const waveHeight: number = 30
  const waveIterationCount: number = Math.ceil(width / (waveWidth*2)) + 1

  ctx.fillStyle = '#FFF'
  ctx.fillRect(0, 0, width, height)

  const grd = ctx.createLinearGradient(0, height/2, 0, height)
  grd.addColorStop(0, '#679ebf')
  grd.addColorStop(1, '#FFF')

  ctx.fillStyle = grd
  
  ctx.beginPath()
  ctx.moveTo(0, height/2)
  
  for (let i=0; i<waveIterationCount; i++) {
    ctx.bezierCurveTo(
      (waveWidth*i*2)+(waveWidth/2)+waveXPosition,
      (height/2),
      (waveWidth*i*2)+(waveWidth/2)+waveXPosition,
      (height/2)+waveHeight,
      (waveWidth*i*2)+waveWidth+waveXPosition,
      (height/2)+waveHeight
    )
    ctx.bezierCurveTo(
      (waveWidth*i*2)+waveWidth+(waveWidth/2)+waveXPosition,
      (height/2)+waveHeight,
      (waveWidth*i*2)+waveWidth+(waveWidth/2)+waveXPosition,
      (height/2),
      (waveWidth*i*2)+(waveWidth*2)+waveXPosition,
      (height/2)
    )
  }
  ctx.lineTo(width, height)
  ctx.lineTo(0, height)
  ctx.closePath()
  ctx.fill()
  
  // Animate wave.
  if (Math.abs(waveXPosition) >= waveWidth*2) {
    waveXPosition = 0
  } else {
    waveXPosition--
  }

  window.requestAnimationFrame(handleNextFrame)
}

const handleCanvasClick = (event: MouseEvent) => {
  console.log('x:', event.clientX, 'y:', event.clientY)
}
</script>

<template>
  <div class="animated-background">
    <canvas
      id="background-canvas"
      @click="handleCanvasClick"
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
