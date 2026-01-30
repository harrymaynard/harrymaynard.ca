<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import IconGitHub from '@/components/icons/IconGitHub.vue'
import IconLinkedIn from '@/components/icons/IconLinkedIn.vue'
import PerlinNoiseWaveBackground from '@/components/PerlinNoiseWaveBackground.vue'

const isMounted = ref<boolean>(false)

onMounted(async () => {
  isMounted.value = true
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
</script>

<template>
  <div class="home-view">
    <PerlinNoiseWaveBackground />
    <Transition name="initial-load">
      <div v-if="isMounted">
        <h1 class="title">
          <span class="text">Harry Maynard</span>
        </h1>
        <div class="links">
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
        </div>
      </div>
    </Transition>
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

  .title .text {
    font-style: normal;
    font-weight: 600;
    color: #EEE;
    font-size: 44px;
    letter-spacing: -0.88px;
    text-shadow: 0 0 8px #000;
  }
  .links {
    margin-top: 30px;
    height: $icon-size;

    a {
      margin: 0 10px;
      display: inline-block;
      
      .icon {
        opacity: 1;
        width: $icon-size;
        height: $icon-size;
        color: #FFF;
        filter: drop-shadow(0px 0px 3px #000);
        transition: all 0.5s ease;

        &.linkedin {
          border-radius: 9px;
        }
      }
      &.has-hover .icon {
        transform: translateY(-6px);
        filter: drop-shadow(0px 0px 6px #FFF);

        &.linkedin {
          color: #0a66c2;
          background: #FFF;
        }
        &.github {
          color: #000;
        }
      }
    }
  }
}

.initial-load-enter-active {
  transition: all 1s ease;
  .title {
    transition: all 1s ease;
  }
  .links a .icon {
    transition: all 0.5s ease;
    transition-delay: 0.5s;
  }
}

.initial-load-enter-from {
  .title {
    opacity: 0;
    transform: translateY(10px);
  }
  .links a .icon {
    $icon-start-size: 10px;
    width: $icon-start-size;
    height: $icon-start-size;
    opacity: 0;
  }
}
</style>
