// @unocss-include
export function setupLoading() {
  // const content = `
  // <div class="container loadding">
  //   <div class="slice"></div>
  //   <div class="slice"></div>
  //   <div class="slice"></div>
  //   <div class="slice"></div>
  //   <div class="slice"></div>
  //   <div class="slice"></div>
  //   <div class="title">Jz博客管理后台</div>
  // </div>`

  const content2 = `
  <div class="container loading" >
    <div class="loader"></div>
    <div class="title">Jz博客管理后台</div>
  </div>`;

  const app = document.querySelector("#app");
  if (app) {
    /* 获取父元素 并新增#loading */
    const parent = app.parentElement;
    const isDark = localStorage.getItem("themeMode") == "dark";

    const loadEl = document.createElement("div");
    loadEl.id = "loading";
    loadEl.innerHTML = content2;
    parent?.appendChild(loadEl);
    loadEl!.style.backgroundColor = isDark ? "#000" : "#fff";
    loadEl!.style.color = isDark ? "#fff" : "#000";
  }
}

/* 移除loading */
export function unLoad() {
  nextTick(() => {
    setTimeout(() => {
      const loading = document.querySelector("#loading");
      loading?.remove();
    }, 1000);
  });
}
