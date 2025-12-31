<template>
  <div id="app-root-component">
    <RouterView />
  </div>
</template>

<style lang="scss">
@font-face {
  font-family:"Manrope";
  src: url("/fonts/Manrope-Regular.woff2") format("woff2");
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: Manrope, sans-serif;
  -webkit-font-smoothing: subpixel-antialiased;
  -moz-osx-font-smoothing: subpixel-antialiased;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
}
body {
  cursor: url('/images/cursors/cursor-24.png') 3 0, default;
}
</style>
