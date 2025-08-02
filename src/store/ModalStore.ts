import { ref } from 'vue'
import { defineStore } from 'pinia'

export enum ModalType {
  Mail = 'mail',
}

interface IModalProps {
  [key: string]: any
}

interface IModalEmits {
  [key: string]: (...args: any[]) => void
}

export interface IModalConfig {
  isOpen: boolean
  props: IModalProps
  emits: IModalEmits
}

export const useModalStore = defineStore('modal-store', () => {
  const modals = ref<Map<ModalType, IModalConfig>>(new Map())

  /**
   * Checks if a modal of the specified type is open.
   * @param type The type of modal to check.
   * @returns Boolean indicating if the modal is open.
   */
  const isOpen = (type: ModalType): boolean => {
    return modals.value.get(type)?.isOpen || false
  }

  /**
   * Opens a modal of the specified type with optional props and emits.
   * @param type The type of modal to open.
   * @param options Optional props and emits for the modal.
   */
  const open = (
    type: ModalType,
    { props = {}, emits = {} }: { props?: IModalProps; emits?: IModalEmits } = {}
  ): void => {
    modals.value.set(type, {
      isOpen: true,
      props,
      emits,
    })
  }

  /**
   * Closes the modal of the specified type.
   * @param type The type of modal to close.
   */
  const close = (
    type: ModalType
  ): void => {
    const modal = modals.value.get(type)

    if (modal && modal.isOpen) {
      modal.isOpen = false
    }
  }

  return {
    modals,
    isOpen,
    open,
    close,
  }
})
