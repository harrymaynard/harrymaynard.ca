<template>
  <div class="page">
    <div>
      <h1 class="title">Harry Maynard</h1>
      <div class="links">
        <a href="https://www.linkedin.com/in/harrymaynard/" target="_blank">
          <img src="../assets/linkedin-icon.svg" alt="LinkedIn" />
        </a>
        <a href="https://github.com/harrymaynard" target="_blank">
          <img src="../assets/github-icon.svg" alt="GitHub" />
        </a>
        <a href="https://twitter.com/theharrymaynard" target="_blank">
          <img src="../assets/twitter-icon.svg" alt="Twitter" />
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.title {
  font-size: 48px;
  cursor: default;
}
.links {
  margin-top: 30px;
}
.links img {
  width: 40px;
  height: 40px;
  margin: 0 10px;
}
</style>
