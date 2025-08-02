import { type Ref } from 'vue'

export const createValidationEvents = (
  changeHandler: (event: Event, shouldValidate: boolean) => void,
  errorMessage: Ref<string | undefined>
) => {
  return {
    blur: (event: Event) => {
      changeHandler(event, true)
    },
    input: (event: Event) => {
      changeHandler(event, !!errorMessage.value)
    },
    change: (event: Event) => {
      changeHandler(event, !!errorMessage.value)
    },
  }
}
