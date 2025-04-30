<template>
  <div id="app-root-component">
    <RouterView />
  </div>
</template>

<style lang="scss">
@font-face {
  font-family:"Linux Libertine";
  src: url("/fonts/LibertinusSerif-Regular.woff2") format("woff2");
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Linux Libertine", Times New Roman;
  -webkit-font-smoothing: subpixel-antialiased;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
}
#app-root-component {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
