<script lang="ts" setup>
import { type PropType } from 'vue'

type ButtonType = 'button' | 'submit' | 'reset'

const props = defineProps({
  type: {
    type: String as PropType<ButtonType>,
    default: 'button',
    validator: (value: string) => ['button', 'submit', 'reset'].includes(value),
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  (eventName: 'click', event: MouseEvent): void
}>()
</script>

<template>
  <button
    :type="props.type"
    :disabled="props.isDisabled"
    @click="emit('click', $event)"
  >
    <slot />
  </button>
</template>

<style lang="scss" scoped>
button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
}
</style>
