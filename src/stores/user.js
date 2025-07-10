import { defineStore } from 'pinia'
import { login, getUserInfo, logout } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { asyncRoutes, constantRoutes } from '@/router'

/**
 * 过滤异步路由
 * @param routes 路由配置
 * @param menus 用户菜单权限
 */
function filterAsyncRoutes(routes, menus) {
  const res = []
  
  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(menus, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, menus)
      }
      res.push(tmp)
    }
  })
  
  return res
}

/**
 * 判断是否有权限
 * @param menus 用户菜单权限
 * @param route 路由
 */
function hasPermission(menus, route) {
  if (route.path && menus) {
    return menus.includes(route.path)
  } else {
    return true
  }
}

export const useUserStore = defineStore('user', {
  state: () => ({
    token: getToken(),
    userInfo: {},
    roles: [],
    routes: [],
    addRoutes: [],
    menus: [],
    permissions: []
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    avatar: (state) => state.userInfo.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
    name: (state) => state.userInfo.username || '',
    introduction: (state) => {
      const roleMap = {
        'superAdmin': '我是超级管理员',
        'admin': '我是管理员',
        'other': '我是普通用户'
      }
      return roleMap[state.userInfo.role] || '我是普通用户'
    }
  },

  actions: {
    // 登录
    async login(userInfo) {
      const { username, password } = userInfo
      try {
        const response = await login({ username: username.trim(), password })
        const { data } = response
        this.token = data.token
        setToken(data.token)
        return Promise.resolve()
      } catch (error) {
        return Promise.reject(error)
      }
    },

    // 获取用户信息
    async getUserInfo() {
      try {
        const response = await getUserInfo()
        const { data } = response
        
        if (!data) {
          throw new Error('验证失败，请重新登录')
        }
        
        const { id, username, email, role, menus, permissions } = data
        
        // 设置角色数组以兼容原有逻辑
        this.roles = [role]
        this.userInfo = { id, username, email, role }
        this.menus = menus || []
        this.permissions = permissions || []
        
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },

    // 生成路由
    async generateRoutes() {
      return new Promise(resolve => {
        let accessedRoutes
        if (this.roles.includes('superAdmin') || this.roles.includes('admin')) {
          accessedRoutes = asyncRoutes || []
        } else {
          accessedRoutes = filterAsyncRoutes(asyncRoutes, this.menus)
        }
        this.addRoutes = accessedRoutes
        this.routes = constantRoutes.concat(accessedRoutes)
        resolve(accessedRoutes)
      })
    },

    // 登出
    async logout() {
      try {
        await logout()
      } catch (error) {
        console.log('登出错误:', error)
      } finally {
        this.token = ''
        this.roles = []
        this.userInfo = {}
        this.routes = []
        this.addRoutes = []
        this.menus = []
        this.permissions = []
        removeToken()
      }
    },

    // 重置token
    resetToken() {
      this.token = ''
      this.roles = []
      this.userInfo = {}
      this.menus = []
      this.permissions = []
      removeToken()
    }
  }
})