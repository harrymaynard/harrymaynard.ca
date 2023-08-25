<script lang="ts" setup>
import IconGitHub from '@/components/icons/IconGitHub.vue'
import IconLinkedIn from '@/components/icons/IconLinkedIn.vue'
import IconTwitter from '@/components/icons/IconTwitter.vue'
</script>

<template>
  <div class="home-page">
    <div>
      <h1 class="title">Harry Maynard</h1>
      <div class="links">
        <a
          href="https://www.linkedin.com/in/harrymaynard/"
          target="_blank"
          title="LinkedIn"
        >
          <IconLinkedIn class="icon"/>
        </a>
        <a
          href="https://github.com/harrymaynard"
          target="_blank"
          title="GitHub"
        >
          <IconGitHub class="icon"/>
        </a>
        <a
          href="https://twitter.com/theharrymaynard"
          target="_blank"
          title="Twitter"
        >
          <IconTwitter class="icon"/>
        </a>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home-page {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  .title {
    font-size: 48px;
    cursor: default;
  }
  .links {
    margin-top: 30px;

    .icon {
      width: 40px;
      height: 40px;
      margin: 0 10px;
      color: #000;
    }
  }
}

</style>
