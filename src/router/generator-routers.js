// eslint-disable-next-line
import * as loginService from '@/api/login'
// eslint-disable-next-line
import { BasicLayout } from '@/layouts'
import { asyncRouterMap } from '@/config/router.config'
import components from '@/utils/components'

// 前端未找到页面路由（固定不用改）
const notFoundRouter = {
  path: '*', redirect: '/404', hidden: true
}

// 根级菜单
const rootRouter = {
  key: '',
  name: 'index',
  path: '',
  component: BasicLayout,
  redirect: '/dashboard',
  meta: {
    title: 'menu.home'
  },
  children: []
}

const getComponent = (item) => {
  if (typeof item.component === 'string') {
    return components.get(item.component)
  }
  return item.component
}

/**
 * 动态生成菜单
 * @param token
 * @returns {Promise<Router>}
 */
export const generatorDynamicRouter = (menus) => {
  console.log(components.get('menu'))
  return new Promise((resolve, reject) => {
      const menuNav = []
      rootRouter.children = menus.concat(asyncRouterMap)
      menuNav.push(rootRouter)
      const routers = generator(menuNav)
      routers.push(notFoundRouter)
      resolve(routers)
  })
}

/**
 * 格式化树形结构数据 生成 vue-router 层级路由表
 *
 * @param routerMap
 * @param parent
 * @returns {*}
 */
export const generator = (routerMap, parent) => {
  return routerMap.map(item => {
    const { title, show, hideChildren, hiddenHeaderContent, target, icon, permission } = item.meta || {}
    const currentRouter = {
      // 如果路由设置了 path，则作为默认 path，否则 路由地址 动态拼接生成如 /dashboard/workplace
      path: item.path || `${parent && parent.path || ''}/${item.key}`,
      // 路由名称，建议唯一
      name: item.name || item.key || '',
      // 该路由对应页面的 组件 :方案1
      // component: constantRouterComponents[item.component || item.key],
      // 该路由对应页面的 组件 :方案2 (动态加载)
      component: getComponent(item),

      // meta: 页面标题, 菜单图标, 页面权限(供指令权限用，可去掉)
      meta: {
        title: title,
        icon: icon || undefined,
        hiddenHeaderContent: hiddenHeaderContent,
        target: target,
        permission: permission || item.name
      }
    }
    // 是否设置了隐藏菜单
    if (show === false) {
      currentRouter.hidden = true
    }
    // 是否设置了隐藏子菜单
    if (hideChildren) {
      currentRouter.hideChildrenInMenu = true
    }
    // 为了防止出现后端返回结果不规范，处理有可能出现拼接出两个 反斜杠
    if (!currentRouter.path.startsWith('http')) {
      currentRouter.path = currentRouter.path.replace('//', '/')
    }
    // 重定向
    item.redirect && (currentRouter.redirect = item.redirect)
    // 是否有子菜单，并递归处理
    if (item.children && item.children.length > 0) {
      // Recursion
      currentRouter.children = generator(item.children, currentRouter)
    }
    return currentRouter
  })
}

/**
 * 数组转树形结构
 * @param list 源数组
 * @param tree 树
 * @param parentId 父ID
 */
// const listToTree = (list, tree, parentId) => {
//   list.forEach(item => {
//     // 判断是否为父级菜单
//     if (item.parentId === parentId) {
//       const child = {
//         ...item,
//         key: item.key || item.name,
//         children: []
//       }
//       // 迭代 list， 找到当前菜单相符合的所有子菜单
//       listToTree(list, child.children, item.id)
//       // 删掉不存在 children 值的属性
//       if (child.children.length <= 0) {
//         delete child.children
//       }
//       // 加入到树中
//       tree.push(child)
//     }
//   })
// }
