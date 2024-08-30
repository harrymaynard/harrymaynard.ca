import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from '@/router/Router'
import App from '@/App.vue'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

window.addEventListener('load', () => {
  app.mount('#app')
})
