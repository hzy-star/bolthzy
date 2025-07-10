import request from '@/utils/request'

// 登录
export function login(data) {
  return request({
    url: '/users/login',
    method: 'post',
    data
  })
}

// 获取用户信息
export function getUserInfo() {
  return request({
    url: '/users/me',
    method: 'get'
  })
}

// 登出
export function logout() {
  return request({
    url: '/users/logout',
    method: 'post'
  })
}

// 获取用户列表
export function getUserList(params) {
  return request({
    url: '/users',
    method: 'get',
    params
  })
}

// 新增用户
export function createUser(data) {
  return request({
    url: '/users',
    method: 'post',
    data
  })
}

// 更新用户
export function updateUser(id, data) {
  return request({
    url: `/users/${id}`,
    method: 'put',
    data
  })
}

// 删除用户
export function deleteUser(id) {
  return request({
    url: `/users/${id}`,
    method: 'delete'
  })
}

// 注册
export function register(data) {
  return request({
    url: '/users/register',
    method: 'post',
    data
  })
}