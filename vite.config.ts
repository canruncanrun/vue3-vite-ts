import { ConfigEnv, UserConfig, loadEnv } from 'vite'
import type { ProxyOptions } from 'vite';
import { resolve } from 'path';
import dayjs from "dayjs";
import vue from '@vitejs/plugin-vue';
import legacy from '@vitejs/plugin-legacy';
import vueJsx from "@vitejs/plugin-vue-jsx";
import svgLoader from "vite-svg-loader";
import DefineOptions from 'unplugin-vue-define-options/vite'
// vite-plugin-compression 开启gzip | brotli 压缩
import viteCompression from 'vite-plugin-compression';
// unplugin-vue-components 按需导入组件
/* import ViteComponents, { ElementPlusResolver } from 'unplugin-vue-components'; */

// 路径查找
function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir);
}

// 当前执行node命令时文件夹的地址（工作目录） 
const CWD = process.cwd();
const __APP_INFO__ = {
  lastBuildTime: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss")
};

/**
 * 多服务器地址
 * @param list
 */
type ProxyItem = [string, string];

type ProxyList = ProxyItem[];

type ProxyTargetList = Record<string, ProxyOptions>;
const httpsRE = /^https:\/\//;

export function createProxy(list: ProxyList = []) {
  const mapProxy: any = new Map(list);
  const ret: ProxyTargetList = {};
  for (const [key, value] of mapProxy.entries()) {
    const isHttps = httpsRE.test(value);
    ret[key] = {
      ws: true,
      // 服务器地址
      target: value,
      // 是否允许跨域
      changeOrigin: true,
      // 请求的 URL 进行重写:如 /api/user/login 等同于 /user/login
      rewrite: (path) => path.replace(new RegExp(`^${key}`), ''),
      // https is require secure=false
      ...(isHttps ? { secure: false } : {}),
    };
  }
  return ret;
}

export default ({ mode }: ConfigEnv): UserConfig => {
  const { VITE_APP_BASE, VITE_APP_HOST, VITE_OUT_DIR } = loadEnv(mode, CWD);
  return {
    // 目录
    base: VITE_APP_BASE,
    resolve: {
      // 设置别名
      alias: [
        // @/ 指向  src
        {
          find: /\/@\//,
          replacement: pathResolve('src') + '/',
        },
        // /#/xxxx => types/xxxx
        {
          find: /\/#\//,
          replacement: pathResolve('types') + '/',
        },
      ],
    },
    plugins: [
      vue(),
      // 浏览器兼容
      legacy({
        targets: ['defaults', 'not IE 11'],
      }),
      DefineOptions(),
      // svg组件化支持
      svgLoader(),
      // Jsx 配置
      vueJsx({}),
      // Gzip 压缩
      viteCompression({
        //生成压缩包gz
        verbose: true,
        disable: false,
        threshold: 10240,
        algorithm: 'gzip',
        ext: '.gz',
      }),
      // 可以实现组件库或内部组件的自动按需引入组件,而不需要手动的进行import,可以帮我们省去不少import的代码
      // ViteComponents({
      //   customComponentResolvers: [
      //     ElementPlusResolver()
      //   ],
      // }),
    ],
    css: {
      preprocessorOptions: {
        less: {
          // modifyVars 全局 less 变量
          modifyVars: "",
          javascriptEnabled: true,
        },
      },
    },
    server: {
      // 是否开启 https
      https: false,
      // 端口号
      port: 9090,
      host: "localhost",
      proxy: createProxy(JSON.parse(VITE_APP_HOST)),
    },

    build: {
      // 打包es版本
      target: "es2015",
      // css 最低版本
      cssTarget: "chrome61",
      minify: "terser",
      terserOptions: {
        // 打包后移除console和注释
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      // 静态资源分类打包
      rollupOptions: {
        output: {
          chunkFileNames: "static/js/[name]-[hash].js",
          entryFileNames: "static/js/[name]-[hash].js",
          assetFileNames: "static/[ext]/[name]-[hash].[ext]"
        },
      },
      // 输出打包目录名称默认 dist
      outDir: VITE_OUT_DIR,
    },
    define: {
      __INTLIFY_PROD_DEVTOOLS__: false,
      __APP_INFO__: JSON.stringify(__APP_INFO__)
    }
  };
};
