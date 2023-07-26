const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  // 打包配置
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  // 关闭代码elint校验
  lintOnSave: false,
  // 禁止生成map文件
  productionSourceMap: false,
  devServer: {
    proxy: {
      '/api': {
        target: `https://console-mock.apipost.cn/mock/282b3afe-ba75-4580-8814-729fca7d1050`,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/'
        }
      }
    }
  }
})
