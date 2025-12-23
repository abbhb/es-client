import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import VueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite';
import {TDesignResolver} from '@tdesign-vue-next/auto-import-resolver';
import path from 'path'
import UnoCSS from 'unocss/vite'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'

function _resolve(...dir: Array<string>) {
  return path.resolve(__dirname, ...dir);
}

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
  let outDir = "dist";
  switch (mode) {
    case "edge":
      outDir = "src-edge/es-client";
      break;
    case "chrome":
      outDir = "src-chrome/es-client";
      break;
    case "firefox":
      outDir = "src-firefox/es-client";
      break;
  }
  return {
    resolve: {
      alias: {
        '@': _resolve('src'),
        "$": _resolve('src', 'core'),
      }
    },
    plugins: [
      vue(), VueJsx(),
      AutoImport({
        resolvers: [TDesignResolver({
          library: 'vue-next'
        })],
        imports: ['vue', '@vueuse/core', 'vue-router']
      }),
      Components({
        resolvers: [
          TDesignResolver({
            library: 'vue-next'
          })
        ]
      }),
      UnoCSS(),
      VueI18nPlugin({
        include: "./src/i18n/locales/*.json", // 扫描目录
        runtimeOnly: false,               // 是否仅运行时加载
        strictMessage: false // 👈 关键：关闭严格模式（含 HTML 检测）
      })
    ],
    base: './',
    build: {
      outDir: outDir,
    },
    server: {
      port: 7743,
      proxy: {
        '/es': {
          target: 'http://localhost:9200',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/es/, '')
        }
      }
    },
    // 强制预构建插件包
    optimizeDeps: {
      include: [
        // `monaco-editor/esm/vs/language/typescript/ts.worker`,
        `monaco-editor/esm/vs/language/json/json.worker`,
        `monaco-editor/esm/vs/editor/editor.worker`
      ],
    },
    envDir: 'env',
    define: {
      __INTLIFY_JIT_COMPILATION__: JSON.stringify(true)
    }
  }
})
