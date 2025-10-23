<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useForm, useField } from 'vee-validate'
import { createValidationEvents } from '@/helpers/ValidationHelper'
import { APIClient } from '@/services/APIClient'
import { type IMailRequestDto } from '@/interfaces/IMailRequestDto'
import Modal from '@/components/modals/Modal.vue'
import Button, { ButtonClassType } from '@/components/Button.vue'
import IconEnvelope from '@/components/icons/IconEnvelope.vue'

const emit = defineEmits<{
  (eventName: 'close'): void
}>()

const { validate } = useForm()

const isLoading = ref<boolean>(false)

const turnstileSiteKey: string = import.meta.env.VITE_TURNSTILE_SITE_KEY || ''
let turnstileToken: string = ''

onMounted(() => {
  // Initialize Turnstile widget
  if (window.turnstile) {
    window.turnstile.render('.cf-turnstile', {
      sitekey: turnstileSiteKey,
      callback: (token: string) => {
        turnstileToken = token
      },
      'expired-callback': () => {
        turnstileToken = ''
      },
    })
  }
})

const handleClickSubmit = async (): Promise<void> => {
  const validationResult = await validate()
  if (!validationResult.valid) return

  isLoading.value = true
  try {
    const payload: IMailRequestDto = {
      name: name.value,
      email: email.value,
      phone: phone.value,
      message: message.value,
      turnstileToken,
    }
    const response = await APIClient.postMail(payload)
    console.log('Mail response:', response)
  } catch (error) {
    console.error('Form submission failed:', error)
  }
  isLoading.value = false
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
  if (value && !/^\+?[0-9\s-]+$/.test(value)) return 'Phone number must be valid'
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
        <IconEnvelope class="mail-icon me-3" />
        Contact Me
      </template>
      <template #body>
        <div class="fieldset">
          <label
            for="name"
            class="mb-1"
          >
            Name:
          </label>
          <input
            id="name"
            v-model="name"
            type="text"
            :disabled="isLoading"
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
          <label
            for="email"
            class="mb-1"
          >
            Email:
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            :disabled="isLoading"
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
          <label
            for="phone"
            class="mb-1"
          >
            Phone number:
          </label>
          <input
            id="phone"
            v-model="phone"
            type="text"
            :disabled="isLoading"
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
          <label
            for="message"
            class="mb-1"
          >
            Message:
          </label>
          <textarea
            id="message"
            v-model="message"
            rows="4"
            :disabled="isLoading"
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
        <div class="fieldset">
          <label class="mb-1">Prove you're not a robot:</label>
          <div
            class="cf-turnstile"
            :data-sitekey="turnstileSiteKey"
          />
        </div>
      </template>
      <template #footer>
        <Button
          type="submit"
          class="me-3"
          :class-type="ButtonClassType.Primary"
          :is-disabled="isLoading"
        >
          Send
        </Button>
        <Button
          type="button"
          :class-type="ButtonClassType.Secondary"
          :is-disabled="isLoading"
          @click="handleClickClose"
        >
          Cancel
        </Button>
      </template>
    </Modal>
  </form>
</template>

<style lang="scss" scoped>
.mail-icon {
  $icon-size: 48px;
  width: $icon-size;
  height: $icon-size;
}
</style>
