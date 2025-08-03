<script lang="ts">
export enum ButtonClassType {
  Primary = 'primary',
  Secondary = 'secondary',
}
</script>

<script lang="ts" setup>
import { type PropType } from 'vue'

type ButtonType = 'button' | 'submit' | 'reset'

const props = defineProps({
  type: {
    type: String as PropType<ButtonType>,
    default: 'button',
    validator: (value: string) => ['button', 'submit', 'reset'].includes(value),
  },
  classType: {
    type: String as PropType<ButtonClassType>,
    default: ButtonClassType.Primary,
    validator: (value: string) => Object.values(ButtonClassType).includes(value as ButtonClassType),
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
    :class="props.classType"
    :disabled="props.isDisabled"
    @click="emit('click', $event)"
  >
    <slot />
  </button>
</template>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;

  &:disabled {
    background-color: #CCC !important;
    border: solid thin #CCC !important;
    color: #666 !important;
    cursor: not-allowed;
  }

  &:focus {
    outline: $primary-outline;
  }

  &.primary {
    background-color: $primary-color;
    color: $secondary-color;
    border: solid thin $primary-color;

    &:hover {
      background-color: $primary-color-hover;
      border-color: $primary-color-hover;
    }
  }

  &.secondary {
    border: solid thin $primary-color;
    color: $primary-color;
    background-color: $secondary-color;

    &:hover {
      border-color: $primary-color-hover;
      color: $primary-color-hover;
      background-color: #EEE;
    }
  }
}
</style>
