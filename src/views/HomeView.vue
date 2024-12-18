<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import IconGitHub from '@/components/icons/IconGitHub.vue'
import IconLinkedIn from '@/components/icons/IconLinkedIn.vue'
import AnimatedBackground from '@/components/AnimatedBackground.vue'

const TITLE: string = 'Harry Maynard'
const TITLE_ANIMATION_INTERVAL: number = 100

const animatedTitle = ref<string>('')
const isTitleAnimationComplete = ref<boolean>(false)

onMounted(() => {
  animateTitle()
})

const handleMouseEnterLink = (event: MouseEvent): void => {
  const target = event.target as HTMLElement
  target.classList.add('has-hover')
}

const handleMouseLeaveLink = (event: MouseEvent): void => {
  const target = event.target as HTMLElement
  target.classList.remove('has-hover')
}

// Prevent the default behaviour of the link to allow the hover effect to be removed on click.
// This is necessary to prevent the issue in Chrome where the regular CSS hover effect remains after the link is clicked.
const handleClickLink = (event: MouseEvent): void => {
  const target = event.currentTarget as HTMLElement
  target.classList.remove('has-hover')
}

const animateTitle = (): void => {
  if (animatedTitle.value.length < TITLE.length) {
    animatedTitle.value += TITLE.charAt(animatedTitle.value.length)
    setTimeout(animateTitle, TITLE_ANIMATION_INTERVAL)
  }
  if (animatedTitle.value.length === TITLE.length) {
    isTitleAnimationComplete.value = true
  }
}
</script>

<template>
  <div class="home-view">
    <AnimatedBackground />
    <div>
      <h1 :class="`title ${isTitleAnimationComplete ? 'title-animation-complete' : ''}`">
        <span>{{ animatedTitle }}</span>
        <span class="cursor">&nbsp;</span>
      </h1>
      <div :class="`links ${isTitleAnimationComplete ? 'title-animation-complete' : ''}`">
        <a
          href="https://www.linkedin.com/in/harrymaynard/"
          target="_blank"
          title="LinkedIn"
          @mouseenter="handleMouseEnterLink"
          @mouseleave="handleMouseLeaveLink"
          @click="handleClickLink"
        >
          <IconLinkedIn class="icon linkedin"/>
        </a>
        <a
          href="https://github.com/harrymaynard"
          target="_blank"
          title="GitHub"
          @mouseenter="handleMouseEnterLink"
          @mouseleave="handleMouseLeaveLink"
          @click="handleClickLink"
        >
          <IconGitHub class="icon github"/>
        </a>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home-view {
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
    text-shadow : 1px 1px 1px #FFF;

    .cursor {
      text-decoration: underline;
      visibility: visible;
    }
    &.title-animation-complete {
      .cursor {
        animation: infinite blink;
        animation-duration: 1s;
      }
    }
  }
  .links {
    margin-top: 30px;

    a {
      margin: 0 10px;
      display: inline-block;
      
      .icon {
        width: 10px;
        height: 10px;
        opacity: 0;
        color: #FFF;
        filter: drop-shadow(0px 0px 3px #679ebf);
        transition: all 0.5s ease;

        &.linkedin {
          border-radius: 9px;
        }
      }
      &.has-hover .icon {
        transform: translateY(-6px);
        filter: none;

        &.linkedin {
          color: #0a66c2;
          background: #FFF;
        }
        &.github {
          color: #000;
        }
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
