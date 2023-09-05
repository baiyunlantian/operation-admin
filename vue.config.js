const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  // 打包配置
  publicPath: "/",
  outputDir: "dist",
  assetsDir: "static",
  // 关闭代码elint校验
  lintOnSave: false,
  // 禁止生成map文件
  productionSourceMap: false,
  devServer: {
    open: true,
    proxy: {
      "/api": {
        // target: `https://console-mock.apipost.cn/mock/bdab25f6-7f13-48a1-9dd1-e6bbb249739a`,
        target: `https://test-api-adm.maliyaka.com`,
        changeOrigin: true,
        pathRewrite: {
          "^/api": "/",
        },
      },
    },
  },
});
