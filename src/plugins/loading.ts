// @unocss-include
import systemLogo from '@/assets/vue.svg';

export function setupLoading() {
  const themeColor = '#5161ce';

  const content = `
  <div class="container loadding">
    <div class="slice"></div>
    <div class="slice"></div>
    <div class="slice"></div>
    <div class="slice"></div>
    <div class="slice"></div>
    <div class="slice"></div>
    <div class="title">Jz博客管理后台</div>
  </div>`

  const content2 = `
  <div class="container loadding">
    <div class="loader"></div>
    <div class="title">Jz博客管理后台</div>
  </div>`

  const loading = `
    <div style="height: 100vh; width: 100vw; display: flex; justify-content: center; align-items: center;">
      ${content2}
      
    </div>
    `;

  const app = document.getElementById('app');

  if (app) {
    app.innerHTML = loading;
  }

}