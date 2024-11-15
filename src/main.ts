import { createApp } from 'vue'
import "@fancyapps/ui/dist/fancybox/fancybox.css";

import App from './App.vue'

import { setupRouter } from './router'
import { setupStore } from './store'
import { setupLoading, unLoad } from '@/plugins'

async function setupApp() {

  const app = createApp(App);
  setupLoading();
  setupStore(app)
  await setupRouter(app)

  // vue3全局变量挂载
  app.mount('#app')


  unLoad()
}

setupApp();
