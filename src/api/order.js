import request from '@/utils/request'

// 获取订单列表
export function getOrderList(params) {
  return request({
    url: '/orders',
    method: 'get',
    params
  })
}

// 获取订单详情
export function getOrderById(id) {
  return request({
    url: `/orders/${id}`,
    method: 'get'
  })
}

// 新增订单
export function createOrder(data) {
  return request({
    url: '/orders',
    method: 'post',
    data
  })
}

// 删除订单
export function deleteOrder(id) {
  return request({
    url: `/orders/${id}`,
    method: 'delete'
  })
}

// 获取订单明细列表
export function getOrderItemList(params) {
  return request({
    url: '/order-items',
    method: 'get',
    params
  })
}

// 新增订单明细
export function createOrderItem(data) {
  return request({
    url: '/order-items',
    method: 'post',
    data
  })
}

// 删除订单明细
export function deleteOrderItem(id) {
  return request({
    url: `/order-items/${id}`,
    method: 'delete'
  })
}