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

})
