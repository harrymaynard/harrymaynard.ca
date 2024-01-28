<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import IconGitHub from '@/components/icons/IconGitHub.vue'
import IconLinkedIn from '@/components/icons/IconLinkedIn.vue'
import AnimatedBackground from '@/components/AnimatedBackground.vue'

const title: string = 'Harry Maynard'

const animatedTitle = ref<string>('')
const isTitleAnimationComplete = ref<boolean>(false)

onMounted(() => {
  animateTitle()
})

const animateTitle = () => {
  if (animatedTitle.value.length < title.length) {
    animatedTitle.value += title.charAt(animatedTitle.value.length)
    setTimeout(animateTitle, 100)
  }
  if (animatedTitle.value.length === title.length) {
    isTitleAnimationComplete.value = true
  }
}
</script>

<template>
  <div class="home-page">
    <AnimatedBackground />
    <div>
      <h1 :class="`title ${isTitleAnimationComplete ? 'animation-complete' : ''}`">
        <span>{{ animatedTitle }}</span>
        <span class="cursor">&nbsp;</span>
      </h1>
      <div :class="`links ${isTitleAnimationComplete ? 'title-animation-complete' : ''}`">
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
    margin-right: -12px;
    color: #000;

    .cursor {
      text-decoration: underline;
      visibility: visible;
    }
    &.animation-complete {
      .cursor {
        animation: infinite blink;
        animation-duration: 1s;
      }
    }
  }
  .links {
    margin-top: 30px;

    a {
      .icon {
        width: 10px;
        height: 10px;
        margin: 0 10px;
        color: #FFF;
        filter: drop-shadow(0px 0px 3px #679ebf);
        transition: all 0.5s ease;
        opacity: 0;
      }
      &:hover .icon {
        color: #000;
        filter: none;
      }
    }
    &.title-animation-complete .icon {
      opacity: 1;
      width: 40px;
      height: 40px;
    }
  }
}
@keyframes blink {
  0% {
    visibility: visible;
  }
  49% {
    visibility: visible;
  }
  50% {
    visibility: hidden;
  }
  100% {
    visibility: hidden;
  }
}
</style>
