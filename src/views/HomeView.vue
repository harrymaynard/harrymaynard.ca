<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useModalStore, ModalType } from '@/store/ModalStore'
import IconGitHub from '@/components/icons/IconGitHub.vue'
import IconLinkedIn from '@/components/icons/IconLinkedIn.vue'
import IconMail from '@/components/icons/IconMail.vue'
import AnimatedBackground from '@/components/AnimatedBackground.vue'

const modalStore = useModalStore()

const TITLE_ANIMATION_DURATION: number = 1000

const isPageMounted = ref<boolean>(false)
const isTitleAnimationComplete = ref<boolean>(false)

onMounted(() => {
  animateTitle()
  isPageMounted.value = true
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

const handleClickMailLink = (event: MouseEvent): void => {
  handleClickLink(event)
  console.log('Clicked mail link')
  // TODO: Open mail modal.
  modalStore.open(ModalType.Mail)
}

const animateTitle = (): void => {
  setTimeout(() => {
    isTitleAnimationComplete.value = true
  }, TITLE_ANIMATION_DURATION)
}
</script>

<template>
  <div class="home-view">
    <AnimatedBackground />
    <div>
      <h1 :class="`title ${isPageMounted ? 'show' : ''}`">
        <span class="text">Harry Maynard</span>
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
          <IconLinkedIn class="icon linkedin" />
        </a>
        <a
          href="https://github.com/harrymaynard"
          target="_blank"
          title="GitHub"
          @mouseenter="handleMouseEnterLink"
          @mouseleave="handleMouseLeaveLink"
          @click="handleClickLink"
        >
          <IconGitHub class="icon github" />
        </a>
        <a
          href="javascript:void(0)"
          title="Send me a message"
          @mouseenter="handleMouseEnterLink"
          @mouseleave="handleMouseLeaveLink"
          @click="handleClickMailLink"
        >
          <IconMail class="icon message" />
        </a>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$icon-size: 40px;

.home-view {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  .title {
    opacity: 0;
    transform: translateY(10px);
    transition: all 1s ease;
    
    .text {
      font-style: normal;
      font-weight: 600;
      color: #EEE;
      font-size: 44px;
      letter-spacing: -0.88px;
      text-shadow: 0 0 8px #000;
    }

    &.show {
      transform: translateY(0);
      opacity: 1;
    }
  }
  .links {
    margin-top: 30px;
    height: $icon-size;

    a {
      margin: 0 10px;
      display: inline-block;
      
      .icon {
        $icon-start-size: 10px;
        width: $icon-start-size;
        height: $icon-start-size;
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

        &.linkedin {
          color: #0a66c2;
          background: #FFF;
          filter: none;
        }
        &.github {
          color: #000;
          filter: none;
        }
        &.message {
          color: rgb(231, 206, 159);
        }
      }
    }
    &.title-animation-complete .icon {
      opacity: 1;
      width: $icon-size;
      height: $icon-size;
    }
  }
}
</style>
