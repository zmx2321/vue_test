import { defineConfig, loadEnv } from 'vite'
import dayjs from 'dayjs'
import { resolve } from 'path'
import { createProxy } from './build/proxy'
import { wrapperEnv } from './build/getEnv'
import { createVitePlugins } from './build/plugins'
import pkg from './package.json'

const { dependencies, devDependencies, name, version } = pkg
// eslint-disable-next-line no-underscore-dangle
const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
}

// eslint-disable-next-line no-control-regex
const INVALID_CHAR_REGEX = /[\u0000-\u001F"#$&*+,:;<=>?[\]^`{|}\u007F]/g
const DRIVE_LETTER_REGEX = /^[a-z]:/i

// @see: https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const root = process.cwd()
  const env = loadEnv(mode, root)
  const viteEnv = wrapperEnv(env)

  // console.log(createProxy(viteEnv.VITE_PROXY))

  return {
    // base: viteEnv.VITE_PUBLIC_PATH,
    // base: env.VITE_USER_NODE_ENV === 'production' ? './' : '/',
    base: './',
    root,
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
        'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'
      }
    },
    define: {
      __APP_INFO__: JSON.stringify(__APP_INFO__)
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/styles/variable.scss";`
        }
      }
    },
    server: {
      host: '0.0.0.0',
      port: viteEnv.VITE_PORT,
      open: viteEnv.VITE_OPEN,
      cors: true,
      // Load proxy configuration from .env.development
      /* proxy: {
        '/api': {
          target: loadEnv(mode, process.cwd()).VITE_PROXY_API,
          ws: true,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        },
      } */
      proxy: createProxy(viteEnv.VITE_PROXY)
    },
    plugins: createVitePlugins(viteEnv),
    esbuild: {
      pure: viteEnv.VITE_DROP_CONSOLE ? ['console.log', 'debugger'] : []
    },
    build: {
      target: 'esnext',
      // esbuild 打包更快，但是不能去除 console.log，terser打包慢，但能去除 console.log
      // minify: "terser",
      // terserOptions: {
      // 	compress: {
      // 		drop_console: viteEnv.VITE_DROP_CONSOLE,
      // 		drop_debugger: true
      // 	}
      // },
      // sourcemap: env.VITE_USER_NODE_ENV !== 'production', // 是否生成源map
      sourcemap: false, // 是否生成源map
      commonjsOptions: {
        include: /node_modules|lib/
      },
      // outDir: 'dist',
      outDir: __dirname.split(/[\\/]/).pop(),
      minify: 'esbuild',
      // 禁用 gzip 压缩大小报告，可略微减少打包时间
      reportCompressedSize: false,
      // 规定触发警告的 chunk 大小
      chunkSizeWarningLimit: 2000,
      // assetsDir: 'assets' // 指定静态资源存放路径
      rollupOptions: {
        output: {
          // Static resource classification and packaging
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
          compact: true, // 这将缩小汇总生成的包装器代码。请注意，这不会影响用户编写的代码。此选项在捆绑预压缩代码时很有用
          manualChunks: {
            // 创建自定义共享公共块
            vue: ['vue', 'vue-router']
          },

          // https://github.com/rollup/rollup/blob/master/src/utils/sanitizeFileName.ts
          // eslint-disable-next-line no-shadow
          sanitizeFileName(name) {
            const match = DRIVE_LETTER_REGEX.exec(name)
            const driveLetter = match ? match[0] : ''
            // A `:` is only allowed as part of a windows drive letter (ex: C:\foo)
            // Otherwise, avoid them because they can refer to NTFS alternate data streams.
            return driveLetter + name.slice(driveLetter.length).replace(INVALID_CHAR_REGEX, '')
          }
        }
      }
    }
  }
})
