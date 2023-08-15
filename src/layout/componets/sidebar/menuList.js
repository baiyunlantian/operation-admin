export default [
  {
    type: 'system',
    name: '首页',
    descType: 'text',
    menuId: '1',
    path: '/home',
    menuData:'indexAdmin',
    children: []
  },
  {
    type:'user',
    name:'个人中心',
    descType:'img',
    menuId:'2',
    path:'',
    children:[
      {
        type:'user',
        name:'个人资料',
        descType:'text',
        menuId:'2-1',
        path:'/info',
        children:[],
      },
      {
        type:'user',
        name:'后台用户列表',
        descType:'text',
        menuId:'2-2',
        path:'/operate',
        children:[],
      },
      {
        type:'logout',
        name:'退出登录',
        descType:'text',
        menuId:'2-3',
        path:'',
        children:[],
      }
    ]
  },
  {
    type: 'system',
    name: '用户管理',
    descType: 'text',
    menuId: '3',
    path: '',
    children: [
      {
        type:'system',
        name:'会员用户列表',
        descType:'text',
        menuId:'3-1',
        path:'/member',
        children:[],
        meta:{level:'用户中心'}
      },
    ]
  },
  {
    type: 'system',
    name: '统计',
    descType: 'text',
    menuId: '4',
    path: '',
    children: [
      {
        type:'system',
        name:'用户统计',
        descType:'text',
        menuId:'4-1',
        path:'/userStatistic',
        children:[],
      },
      {
        type:'system',
        name:'交易统计',
        descType:'text',
        menuId:'4-2',
        path:'/tradingStatistic',
        children:[],
      },
    ]
  },
  {
    type: 'system',
    name: '分销',
    descType: 'text',
    menuId: '5',
    path: '',
    children: [
      {
        type:'system',
        name:'我的邀新列表',
        descType:'text',
        menuId:'5-1',
        path:'/invite',
        children:[],
      },
      {
        type:'system',
        name:'分销管理',
        descType:'text',
        menuId:'5-2',
        path:'/distribution',
        children:[],
      },
    ]
  },
  {
    type: 'system',
    name: '课程用户',
    descType: 'text',
    menuId: '6',
    path: 'course',
    children: []
  },
]