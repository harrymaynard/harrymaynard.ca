<script lang="ts" setup>
import { onMounted, onBeforeUnmount } from 'vue'

let isComponentMounted: boolean = false
let canvasEl: HTMLCanvasElement
let ctx: CanvasRenderingContext2D
let circleXPosition: number = 0

onMounted(() => {
  canvasEl = document.getElementById('background-canvas') as HTMLCanvasElement
  ctx = canvasEl.getContext("2d") as CanvasRenderingContext2D

  // Set display size (css pixels).

  canvasEl.style.width = `${document.body.clientWidth}px`
  canvasEl.style.height = `${document.body.clientHeight}px`

  // Set actual size in memory (scaled to account for extra pixel density).
  const scale = window.devicePixelRatio // Change to 1 on retina screens to see blurry canvasEl.
  canvasEl.width = Math.floor(document.body.clientWidth * scale)
  canvasEl.height = Math.floor(document.body.clientHeight * scale)

  // Normalize coordinate system to use CSS pixels.
  ctx.scale(scale, scale)

  isComponentMounted = true
  window.requestAnimationFrame(handleNextFrame)
})

onBeforeUnmount(() => {
  isComponentMounted = true
})

const handleNextFrame = () => {
  if (!isComponentMounted) return

  const width = document.body.clientWidth
  const height = document.body.clientHeight

  ctx.fillStyle = '#FFF'
  ctx.fillRect(0, 0, width, height)

  ctx.fillStyle = 'rgba(255,0,0,0.2)'
  ctx.moveTo(0, height/2)
  ctx.beginPath()
  ctx.lineTo(1, (height/2))
  
  ctx.bezierCurveTo(
    150,
    (height/2),
    150,
    (height/2)+100,
    300,
    (height/2)+100
  )
  ctx.bezierCurveTo(
    450,
    (height/2)+100,
    450,
    (height/2),
    600,
    (height/2)
  )
  ctx.lineTo(width, height)
  ctx.lineTo(0, height)
  ctx.closePath()
  ctx.fill()
  circleXPosition++

  //window.requestAnimationFrame(handleNextFrame)
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
  //z-index: -1;
  background: #FFF;
}
</style>
