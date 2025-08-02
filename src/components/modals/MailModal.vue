<script lang="ts" setup>
import { useForm, useField } from 'vee-validate'
import { createValidationEvents } from '@/helpers/ValidationHelper'
import Modal from '@/components/modals/Modal.vue'
import Button from '@/components/Button.vue'

const emit = defineEmits<{
  (eventName: 'close'): void
}>()

const { validate } = useForm()

const handleClickSubmit = async (): Promise<void> => {
  const validationResult = await validate()
  if (!validationResult.valid) return
  
  console.log('Form submitted')
  // TODO: Handle form submission.
}

const handleClickClose = (): void => {
  emit('close')
}

const validateName = (value: string): string | true => {
  if (!value) return 'Name is required'
  return true
}

const validateEmail = (value: string): string | true => {
  if (!value) return 'Email is required'
  if (!/\S+@\S+\.\S+/.test(value)) return 'Email must be valid'
  return true
}

const validatePhone = (value: string): string | true => {
  if (!value) return 'Phone number is required'
  if (!/^\+?[0-9\s-]+$/.test(value)) return 'Phone number must be valid'
  return true
}

const validateMessage = (value: string): string | true => {
  if (!value) return 'Message is required'
  return true
}

const {
  value: name,
  errorMessage: errorMessageName,
  handleChange: handleChangeName,
} = useField<string>(
  'name',
  validateName,
  {
    initialValue: '',
    syncVModel: false,
    validateOnValueUpdate: false,
  }
)

const {
  value: email,
  errorMessage: errorMessageEmail,
  handleChange: handleChangeEmail,
} = useField<string>(
  'email',
  validateEmail,
  {
    initialValue: '',
    syncVModel: false,
    validateOnValueUpdate: false,
  }
)

const {
  value: phone,
  errorMessage: errorMessagePhone,
  handleChange: handleChangePhone,
} = useField<string>(
  'phone',
  validatePhone,
  {
    initialValue: '',
    syncVModel: false,
    validateOnValueUpdate: false,
  }
)

const {
  value: message,
  errorMessage: errorMessageMessage,
  handleChange: handleChangeMessage,
} = useField<string>(
  'message',
  validateMessage,
  {
    initialValue: '',
    syncVModel: false,
    validateOnValueUpdate: false,
  }
)

const nameValidationEvents = createValidationEvents(handleChangeName, errorMessageName)
const emailValidationEvents = createValidationEvents(handleChangeEmail, errorMessageEmail)
const phoneValidationEvents = createValidationEvents(handleChangePhone, errorMessagePhone)
const messageValidationEvents = createValidationEvents(handleChangeMessage, errorMessageMessage)
</script>

<template>
  <form @submit.prevent="handleClickSubmit">
    <Modal>
      <template #header>
        <h2>Contact Me</h2>
      </template>
      <template #body>
        <div class="fieldset">
          <label for="name">Name:</label>
          <input
            id="name"
            v-model="name"
            type="text"
            v-on="nameValidationEvents"
          >
          <div
            v-if="errorMessageName"
            class="text-danger"
            aria-live="assertive"
          >
            {{ errorMessageName }}
          </div>
        </div>
        <div class="fieldset">
          <label for="email">Email:</label>
          <input
            id="email"
            v-model="email"
            type="email"
            v-on="emailValidationEvents"
          >
          <div
            v-if="errorMessageEmail"
            class="text-danger"
            aria-live="assertive"
          >
            {{ errorMessageEmail }}
          </div>
        </div>
        <div class="fieldset">
          <label for="phone">Phone number:</label>
          <input
            id="phone"
            v-model="phone"
            type="text"
            v-on="phoneValidationEvents"
          >
          <div
            v-if="errorMessagePhone"
            class="text-danger"
            aria-live="assertive"
          >
            {{ errorMessagePhone }}
          </div>
        </div>
        <div class="fieldset">
          <label for="message">Message:</label>
          <textarea
            id="message"
            v-model="message"
            v-on="messageValidationEvents"
          />
          <div
            v-if="errorMessageMessage"
            class="text-danger"
            aria-live="assertive"
          >
            {{ errorMessageMessage }}
          </div>
        </div>
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