<script lang="ts" setup>
import { onMounted } from 'vue'

onMounted(() => {
  import('@/features/wave-sim/helpers/Waves')
})
</script>

<template>
  <div
    ref="AnimatedBackgroundContainerEl"
    class="animated-background"
  >
    <!-- <canvas
      id="background-canvas"
      ref="backgroundCanvasEl"
    /> -->
    <!-- <div id="overlay" /> -->
    <div id="ui">
      <div id="camera">
        <canvas id="profile" width="350" height="105"></canvas>
        <div id="length"></div>
        <div id="end"></div>
        <div id="wind">
          <span id="wind-speed"></span><span id="wind-unit"> m/s</span>
          <div id="wind-label">WIND</div>
        </div>

        <div id="size">
          <span id="size-value"></span><span id="size-unit"> m</span>
        </div>
        <div id="size-label">SIZE</div>
        <div id="choppiness"></div>
        <div id="choppiness-label">CHOPPINESS</div>
      </div>
    </div>
    <canvas id="simulator"></canvas>
    <div id="error">Your browser does not appear to support the required technologies.I recommend viewing the  simulation with a computer. For a much better visualization.</div>
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
