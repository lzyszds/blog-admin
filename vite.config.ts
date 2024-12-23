import { fileURLToPath, URL } from "node:url";
import { resolve } from "node:path";
import * as process from "node:process";
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import VueDevTools from "vite-plugin-vue-devtools";
import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import { visualizer } from "rollup-plugin-visualizer";
import viteCompression from "vite-plugin-compression";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import AutoImport from "unplugin-auto-import/vite";
import dns from "dns";
import autoprefixer from "autoprefixer";

const CWD = process.cwd();
dns.setDefaultResultOrder("verbatim");
// https://vitejs.dev/config/
export default ({ mode }: any) => {
  const env = loadEnv(mode, CWD);
  console.log(mode, env, CWD);
  return defineConfig({
    plugins: [
      vue(),
      VueDevTools({
        launchEditor: "webstorm",
      }),
      Components({
        resolvers: [
          AntDesignVueResolver({
            importStyle: "css-in-js",
          }),
        ],
      }),
      AutoImport({
        imports: ["vue", "vue-router", "@vueuse/core", "pinia"],
        dts: true,
      }),
      createSvgIconsPlugin({
        // Specify the icon folder to be cached
        iconDirs: [resolve(CWD, "src/assets/svg")],
        // Specify symbolId format
        symbolId: "svg-icon-[dir]-[name]",
      }),
      visualizer({
        open: true,
        gzipSize: true,
        brotliSize: true,
        filename: "dist/stats.html",
      }),
      viteCompression({
        verbose: true,
        disable: true,
        threshold: 10240,
        algorithm: "gzip",
        ext: ".gz",
      }),
      ViteImageOptimizer(),
    ],
    build: {
      rollupOptions: {
        output: {
          chunkFileNames: "js/[name]-[hash].js", // 引入文件名的名称
          entryFileNames: "js/[name]-[hash].js", // 包的入口文件名称
          assetFileNames: "[ext]/[name]-[hash].[ext]", // 资源文件像 字体，图片等
          // 最小化拆分包
          manualChunks(id) {
            if (id.includes("node_modules")) {
              return id
                .toString()
                .split("node_modules/")[1]
                .split("/")[0]
                .toString();
            }
          },
        },
      },
    },
    css: {
      postcss: {
        plugins: [autoprefixer],
      },
      // preprocessorOptions: {
      //   less: {
      //     javascriptEnabled: true,
      //   },
      // },
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      host: "localhost",
      open: false,
      port: 1026,
      proxy: {
        /*图床代理*/
        "/pictureBedImage": {
          target: env.VITE_PICTURE_BED_IMAGE, // 接口的域名
          secure: false, // 如果是https接口，需要配置这个参数
          changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
          rewrite: (path) => path.replace(/^\/pictureBedImage/, ""),
        },
      },
    },
  });
};
