const navCtrl = {
  namespaced: true,
  state() {
    return {
      navCtrl: [{
        meta: { level: '首页' },
        name: 'home',
        path: "/home",
      }],
      navPath: '/home'
    }
  },
  mutations: {
    // 设置导航
    setNavCtrl(state, data) {
      if (!data) {
        state.navCtrl = [{
          meta: { level: '首页' },
          name: 'home',
          path: "/home"
        }]
      } else {
        var arr = []
        state.navCtrl.forEach((item, index) => {
          if(item.name == data.name){
            item.path =data.path
          }
          arr.push(item.name)
        })
        if (arr.indexOf(data.name) == -1) {
          state.navCtrl.push(data)
        } else {
          state.navPath = data.path
          sessionStorage.setItem('navPath', state.navPath)
        }
        var navCtrl = JSON.stringify(state.navCtrl)
        sessionStorage.setItem('navCtrl', navCtrl)
      }
    },
    setNavPath(state, data) {
      state.navPath = data
      sessionStorage.setItem('navPath', state.navPath)
    },

  },
  actions: {
  },
  getters: {
    getNavCtrl: state => state.navCtrl,
    getNavPath: state => state.navPath
  }
}

export default navCtrl;

