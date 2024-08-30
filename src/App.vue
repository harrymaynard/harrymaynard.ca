<template>
  <div id="app">
    <RouterView/>
  </div>
</template>

<style>
@font-face {
  font-family:"Linux Libertine";
  src: url("/fonts/LinLibertine_R.ttf");
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Linux Libertine", Times New Roman;
}
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
