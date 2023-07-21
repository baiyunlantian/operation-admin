# documents_chat_ai

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```
### 安装依赖
element-plus
node-sass
element-icon
vuex
axios

### 如遇到node-sass报错可以尝试使用该指令
npm install -g mirror-config-china --registry=http://registry.npm.taobao.org

### 项目文件备注
路由文件
如无需动态路由加载可以在router/index.js中routes数据添加即可
在/router/modules/路由文件新建格式如下
export default [
    {
        path: '/test',      // 路由路径 必填
        component: layout,  // 路由组件 必填
        meta: {title: "测试"} //路由meta标签可以用于tags名称 必填
        name: "test",       // 路由名称 必填
        permission: 1,      // 路由权限码 必填
        children: [
            {
                path: 'index',    
                component: () => import('@/pages/test/index.vue'),
                name: '测试页面',
                permission: 1
                default: "/index"  //路由默认重定向位置 非必填 父路由重新定向位置 路由生成位置 redirect: { path: '/test/[default || path]' }放于父集，动态路由可以用default
            }
        ]
    }
]






### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
