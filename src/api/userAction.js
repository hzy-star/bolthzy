import request from '@/utils/request'

// 获取用户行为列表
export function getUserActionList(params) {
  return request({
    url: '/user-actions',
    method: 'get',
    params
  })
}

// 获取用户行为详情
export function getUserActionById(id) {
  return request({
    url: `/user-actions/${id}`,
    method: 'get'
  })
}

// 新增用户行为
export function createUserAction(data) {
  return request({
    url: '/user-actions',
    method: 'post',
    data
  })
}

// 删除用户行为
export function deleteUserAction(id) {
  return request({
    url: `/user-actions/${id}`,
    method: 'delete'
  })
}