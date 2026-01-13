<script lang="ts" setup>
import p5 from 'p5'
import { onBeforeUnmount, onMounted, ref, Ref } from 'vue'

const backgroundCanvasEl = ref<HTMLCanvasElement>() as Ref<HTMLCanvasElement>
const AnimatedBackgroundContainerEl = ref<HTMLDivElement>() as Ref<HTMLDivElement>

const ranges: number = 50

const sketch = (p: p5) => {
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight, p.P2D, backgroundCanvasEl.value as HTMLCanvasElement)
    p.pixelDensity(p.displayDensity())
  }

  p.draw = () => {
    p.frameRate(30)
    p.clear()
    
    p.noFill()
    p.strokeWeight(2)

    for (let i = 0; i < ranges; i++) {
      // Map the iteration to an alpha/color value
      const paint = p.map(i, 0, ranges, 0, 255)
      
      // Stroke color: White with varying transparency
      p.stroke(255, paint)
      
      p.beginShape()
      // Draw vertices across the width of the screen
      // We add a small margin (-10 to width + 11) to ensure lines go off-screen
      for (let x = -10; x < p.width + 11; x += 20) {  
        /* Perlin Noise Logic:
            1. x * 0.001: Horizontal variance
            2. i * 0.01: Vertical variance between different lines
            3. p.frameCount * 0.002: Evolution over time (animation)
        */
        const n = p.noise(x * 0.001, i * 0.01, p.frameCount * 0.002)
        
        // Map the noise value (0.0 to 1.0) to the canvas height
        const y = p.map(n, 0, 1, 0, p.height)
        
        p.vertex(x, y)
      }
      p.endShape()
    }
  }

  // Handle window resizing to keep the canvas full-screen
  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight) 
  }
}

let p5Instance: p5 | null = null

onMounted(() => {
  p5Instance = new p5(sketch, AnimatedBackgroundContainerEl.value as HTMLDivElement)
})

onBeforeUnmount(() => {
  if (p5Instance) {
    p5Instance.remove()
    p5Instance = null
  }
})
</script>

<template>
  <div
    ref="AnimatedBackgroundContainerEl"
    class="animated-background"
  >
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
  background:linear-gradient(rgb(103, 157, 191), rgb(0,0,0));
}
</style>
