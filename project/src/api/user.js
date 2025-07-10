import request from '@/utils/request'

// 登录
export function login(data) {
  // 模拟登录API
  return new Promise((resolve) => {
    setTimeout(() => {
      if (data.username === 'admin' && data.password === '123456') {
        resolve({
          data: {
            token: 'admin-token-' + Date.now()
          }
        })
      } else if (data.username === 'user' && data.password === '123456') {
        resolve({
          data: {
            token: 'user-token-' + Date.now()
          }
        })
      } else {
        throw new Error('用户名或密码错误')
      }
    }, 1000)
  })
}

// 获取用户信息
export function getUserInfo() {
  // 模拟获取用户信息API
  return new Promise((resolve) => {
    setTimeout(() => {
      const token = localStorage.getItem('vue-admin-token') || ''
      if (token.includes('admin-token')) {
        resolve({
          data: {
            roles: ['admin'],
            name: '管理员',
            avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
            introduction: '我是超级管理员'
          }
        })
      } else {
        resolve({
          data: {
            roles: ['user'],
            name: '普通用户',
            avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
            introduction: '我是普通用户'
          }
        })
      }
    }, 500)
  })
}

// 登出
export function logout() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: 'success' })
    }, 200)
  })
}

// 获取用户列表
export function getUserList(params) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const users = [
        {
          id: 1,
          username: 'admin',
          name: '管理员',
          email: 'admin@example.com',
          phone: '13800138000',
          status: 1,
          roles: ['admin'],
          createTime: '2024-01-01 10:00:00'
        },
        {
          id: 2,
          username: 'user',
          name: '普通用户',
          email: 'user@example.com',
          phone: '13800138001',
          status: 1,
          roles: ['user'],
          createTime: '2024-01-02 10:00:00'
        }
      ]
      resolve({
        data: {
          list: users,
          total: users.length
        }
      })
    }, 500)
  })
}