// import {
//   website
// } from '@/common/luch-request/utils.js';
module.exports = {
    /* 部署生产环境和开发环境下的URL：可对当前环境进行区分，baseUrl 从 Vue CLI 3.3 起已弃用，要使用publicPath */
    publicPath: "",
    assetsDir: "static/lipin",
    outputDir: "dist",
    runtimeCompiler: true,
    productionSourceMap: false,
    /* webpack-dev-server 相关配置 */
    devServer: {
      /* 自动打开浏览器 */
      open: true,
      /* 设置为0.0.0.0则所有的地址均能访问 */
      host: '0.0.0.0',  
      port: 80,  
      https: false,
      hotOnly: false,
      /* 使用代理 */
      proxy: {
        '/api': {
          /* 目标代理服务器地址 */
          target: 'https://api.dx2188.net/home/',
          /* 允许跨域 */
          changeOrigin: true,
          "pathRewrite": {
            "^/api": "" //匹配请求路径里面有 /api 替换成 https://www.xxx.cn
          },
        },
      },
    }
}