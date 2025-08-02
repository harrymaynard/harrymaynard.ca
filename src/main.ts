import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedState from 'pinia-plugin-persistedstate'
import router from '@/router/Router'
import App from '@/App.vue'
import '@/styles/main.scss'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedState)

app.use(pinia)
app.use(router)

window.addEventListener('load', () => {
  app.mount('#app')
})
