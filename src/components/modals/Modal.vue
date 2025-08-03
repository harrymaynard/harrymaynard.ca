<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, type Ref } from 'vue'

let focusableEls: HTMLElement[] = []
let focusedEl: HTMLElement | null = null
const modal = ref<HTMLElement>() as Ref<HTMLElement>

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
  document.body.classList.add('no-scroll')
  focusableEls = getFocusableEls()
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown)
  document.body.classList.remove('no-scroll')
})

const getFocusableEls = (): Array<HTMLElement> => {
  // Create an array of focusable elements from the contents of the modal
  return Array.from(modal.value.querySelectorAll('a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button, [tabindex="0"]'))
}

const handleKeyDown = (event) => {
  // Handle tabbing
  if (event.key === 'Tab') {
    // Prevent usual tabbing, manually set focus
    event.preventDefault()
    if (event.shiftKey) {
      handleTabBackwards()
    } else {
      handleTab()
    }
  }
}

// Move to next focusable element, if at last element, move to first
const handleTab = () => {
  if (!focusedEl && focusableEls.length > 0) {
    focusedEl = focusableEls[0]
    focusedEl.focus()
    return
  }
  const position = focusableEls.indexOf(focusedEl)
  if (position === focusableEls.length - 1) {
    focusedEl = focusableEls[0]
  } else {
    focusedEl = focusableEls[position + 1]
  }
  focusedEl.focus()
}

// Move to next focusable element, if at last element, move to first
const handleTabBackwards = () => {
  if (!focusedEl && focusableEls.length > 0) {
    focusedEl = focusableEls[focusableEls.length - 1]
    focusedEl.focus()
    return
  }
  const position = focusableEls.indexOf(focusedEl)
  if (position === 0) {
    focusedEl = focusableEls[focusableEls.length - 1]
  } else {
    focusedEl = focusableEls[position - 1]
  }
  focusedEl.focus()
}
</script>

<template>
  <div ref="modal">
    <div
      class="modal show"
      tabindex="-1"
      role="dialog"
      aria-labelledby="modal-title"
    >
      <div
        class="modal-dialog"
        role="document"
      >
        <div class="modal-content">
          <div class="modal-header">
            <h2
              id="modal-title"
              class="modal-title"
            >
              <slot name="header" />
            </h2>
          </div>
          <div class="modal-body">
            <slot name="body" />
          </div>
          <div class="modal-footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 1050;
  overflow-y: auto;
  overflow-x: hidden;
  opacity: 1;

  .modal-dialog  {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: calc(100% - 3.5rem);
    margin: 1.75rem auto;
    opacity: 1;

    .modal-content {
      width: 500px;
      display: flex;
      flex-direction: column;
      background-color: #fff;
      border-radius: 0.3rem;
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
      padding: 1rem;  
    }

    .modal-title {
      font-size: 2rem;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
