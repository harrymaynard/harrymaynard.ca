<script lang="ts" setup>
import Modal from '@/components/modals/Modal.vue'
import Button from '@/components/Button.vue'

const emit = defineEmits<{
  (eventName: 'close'): void
}>()

const handleClickSubmit = (event: Event): void => {
  event.preventDefault()
  console.log('Form submitted')
}

const handleClickClose = (): void => {
  emit('close')
  console.log('Modal closed')
}
</script>

<template>
  <form @submit="handleClickSubmit">
    <Modal>
      <template #header>
        <h2>Contact Me</h2>
      </template>
      <template #body>
        <p>Please fill out the form below to get in touch.</p>
        <!-- Form fields go here -->
      </template>
      <template #footer>
        <Button
          type="button"
          @click="handleClickClose"
        >
          Close
        </Button>
      </template>
    </Modal>
  </form>
</template>