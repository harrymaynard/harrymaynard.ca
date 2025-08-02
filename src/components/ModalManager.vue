<script lang="ts" setup>
import { useModalStore, ModalType } from '@/store/ModalStore'
import MailModal from './modals/MailModal.vue'

const modalStore = useModalStore()
</script>

<template>
  <div class="modal-manager">
    <TransitionGroup
      name="modal"
    >
      <MailModal
        v-if="modalStore.modals.get(ModalType.Mail)?.isOpen"
        :="modalStore.modals.get(ModalType.Mail)?.props"
        @="modalStore.modals.get(ModalType.Mail)?.emits"
        @close="modalStore.close(ModalType.Mail)"
      />
    </TransitionGroup>
  </div>
</template>
