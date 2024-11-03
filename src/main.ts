import { createApp } from 'vue'
import '@/style/style.css'
import App from './App.vue'
import { setupRouter } from './router'
import { setupStore } from './store'
import { setupLoading, unLoad } from '@/plugins'

async function setupApp() {

  const app = createApp(App);
  setupLoading();
  setupStore(app)
  await setupRouter(app)
  app.mount('#app')

  unLoad()
}

setupApp();
