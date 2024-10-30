import { createApp } from 'vue'
import '@/style/style.css'
import App from './App.vue'
import router from './router'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import { createPinia } from 'pinia'

const pinia = createPinia().use(piniaPluginPersistedstate)


createApp(App)
  .use(router)
  .use(pinia)

  .mount('#app')
