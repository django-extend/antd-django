/**
 * 向后端请求用户的菜单，动态生成路由
 */
import { constantRouterMap } from '@/config/router.config'
import { generatorDynamicRouter } from '@/router/generator-routers'

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes ({ commit }, data) {
      // 动态菜单步骤3: 收到指令，调用步骤4函数生成路由
      return new Promise(resolve => {
        const { menus } = data
        generatorDynamicRouter(menus).then(routers => {
          // 动态菜单步骤5: 将路由写入本地存储
          commit('SET_ROUTERS', routers)
          resolve()
        })
      })
    }
  }
}

export default permission
