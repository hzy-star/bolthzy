import { defineStore } from 'pinia'
import { login, getUserInfo, logout } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { asyncRoutes, constantRoutes } from '@/router'

/**
 * 过滤异步路由
 * @param routes 路由配置
 * @param roles 用户角色
 */
function filterAsyncRoutes(routes, roles) {
  const res = []
  
  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })
  
  return res
}

/**
 * 判断是否有权限
 * @param roles 用户角色
 * @param route 路由
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
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
    addRoutes: []
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    avatar: (state) => state.userInfo.avatar || '',
    name: (state) => state.userInfo.name || '',
    introduction: (state) => state.userInfo.introduction || ''
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
        
        const { roles, name, avatar, introduction } = data
        
        // 角色必须是非空数组
        if (!roles || roles.length <= 0) {
          throw new Error('用户角色不能为空')
        }
        
        this.roles = roles
        this.userInfo = { name, avatar, introduction, id: Date.now() }
        
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },

    // 生成路由
    async generateRoutes() {
      return new Promise(resolve => {
        let accessedRoutes
        if (this.roles.includes('admin')) {
          accessedRoutes = asyncRoutes || []
        } else {
          accessedRoutes = filterAsyncRoutes(asyncRoutes, this.roles)
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
        removeToken()
      }
    },

    // 重置token
    resetToken() {
      this.token = ''
      this.roles = []
      this.userInfo = {}
      removeToken()
    }
  }
})