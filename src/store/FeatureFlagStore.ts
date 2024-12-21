import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFeatureFlagStore = defineStore('feature-flag-store', () => {
  const isWeatherEnabled = ref<boolean>(true)

  return { 
    isWeatherEnabled,
   }
}, {
  persist: {
    storage: sessionStorage,
  },
})
