import { createApp } from 'vue'
import '@/style/style.css'
import App from './App.vue'
import { setupRouter } from './router'
import { setupStore } from './store'
import { setupLoading } from '@/plugins'

async function setupApp() {
  setupLoading();

  const app = createApp(App);
  setupStore(app)
  await setupRouter(app)
  app.mount('#app')
}

setupApp();
