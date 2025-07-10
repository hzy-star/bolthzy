<template>
  <div class="order-list">
    <div class="page-card">
      <div class="page-header">
        <h2>订单列表</h2>
        <el-button type="primary" @click="handleExport">
          <el-icon><Download /></el-icon>
          导出订单
        </el-button>
      </div>

      <!-- 搜索区域 -->
      <div class="search-section">
        <el-form :model="searchForm" inline>
          <el-form-item label="订单号">
            <el-input
              v-model="searchForm.orderNo"
              placeholder="请输入订单号"
              clearable
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="用户名">
            <el-input
              v-model="searchForm.username"
              placeholder="请输入用户名"
              clearable
              style="width: 150px"
            />
          </el-form-item>
          <el-form-item label="订单状态">
            <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 150px">
              <el-option label="待付款" value="pending" />
              <el-option label="已付款" value="paid" />
              <el-option label="已发货" value="shipped" />
              <el-option label="已完成" value="completed" />
              <el-option label="已取消" value="cancelled" />
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="searchForm.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 240px"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 表格区域 -->
      <div class="table-container">
        <el-table
          v-loading="loading"
          :data="tableData"
          style="width: 100%"
          border
        >
          <el-table-column prop="orderNo" label="订单号" width="180" />
          <el-table-column prop="username" label="用户名" width="120" />
          <el-table-column prop="products" label="商品信息" min-width="200">
            <template #default="{ row }">
              <div class="product-info">
                <div v-for="product in row.products" :key="product.id" class="product-item">
                  <el-image
                    :src="product.image"
                    style="width: 40px; height: 40px; margin-right: 8px"
                    fit="cover"
                  />
                  <span>{{ product.name }} x{{ product.quantity }}</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="totalAmount" label="订单金额" width="120">
            <template #default="{ row }">
              <span class="amount">¥{{ row.totalAmount }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="订单状态" width="120">
            <template #default="{ row }">
              <el-tag :type="getStatusColor(row.status)">
                {{ getStatusName(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="paymentMethod" label="支付方式" width="120">
            <template #default="{ row }">
              <el-tag type="info">{{ getPaymentName(row.paymentMethod) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="160" />
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" size="small" @click="handleView(row)">
                查看
              </el-button>
              <el-button 
                v-if="row.status === 'paid'" 
                type="success" 
                size="small" 
                @click="handleShip(row)"
              >
                发货
              </el-button>
              <el-button 
                v-if="row.status === 'pending'" 
                type="danger" 
                size="small" 
                @click="handleCancel(row)"
              >
                取消
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
      <div class="pagination-section">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.size"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 订单详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="订单详情"
      width="800px"
    >
      <div v-if="currentOrder" class="order-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="订单号">{{ currentOrder.orderNo }}</el-descriptions-item>
          <el-descriptions-item label="用户名">{{ currentOrder.username }}</el-descriptions-item>
          <el-descriptions-item label="订单状态">
            <el-tag :type="getStatusColor(currentOrder.status)">
              {{ getStatusName(currentOrder.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="支付方式">{{ getPaymentName(currentOrder.paymentMethod) }}</el-descriptions-item>
          <el-descriptions-item label="订单金额">¥{{ currentOrder.totalAmount }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ currentOrder.createTime }}</el-descriptions-item>
        </el-descriptions>

        <h4 style="margin: 20px 0 10px 0">商品信息</h4>
        <el-table :data="currentOrder.products" border>
          <el-table-column prop="name" label="商品名称" />
          <el-table-column prop="price" label="单价">
            <template #default="{ row }">¥{{ row.price }}</template>
          </el-table-column>
          <el-table-column prop="quantity" label="数量" />
          <el-table-column label="小计">
            <template #default="{ row }">¥{{ (row.price * row.quantity).toFixed(2) }}</template>
          </el-table-column>
        </el-table>

        <h4 style="margin: 20px 0 10px 0">收货地址</h4>
        <el-descriptions :column="1" border>
          <el-descriptions-item label="收货人">{{ currentOrder.address.name }}</el-descriptions-item>
          <el-descriptions-item label="联系电话">{{ currentOrder.address.phone }}</el-descriptions-item>
          <el-descriptions-item label="收货地址">{{ currentOrder.address.detail }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getOrderList, getOrderById, deleteOrder } from '@/api/order'

const loading = ref(false)
const detailDialogVisible = ref(false)
const currentOrder = ref(null)

const searchForm = reactive({
  orderNo: '',
  username: '',
  status: '',
  dateRange: []
})

const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

const tableData = ref([])

// 获取订单状态名称
const getStatusName = (status) => {
  const statusMap = {
    pending: '待付款',
    paid: '已付款',
    shipped: '已发货',
    completed: '已完成',
    cancelled: '已取消'
  }
  return statusMap[status] || '未知'
}

// 获取订单状态颜色
const getStatusColor = (status) => {
  const colorMap = {
    pending: 'warning',
    paid: 'primary',
    shipped: 'success',
    completed: 'success',
    cancelled: 'danger'
  }
  return colorMap[status] || 'default'
}

// 获取支付方式名称
const getPaymentName = (method) => {
  const methodMap = {
    alipay: '支付宝',
    wechat: '微信支付',
    bank: '银行卡',
    cash: '货到付款'
  }
  return methodMap[method] || '未知'
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  fetchOrderList()
}

// 重置搜索
const handleReset = () => {
  Object.assign(searchForm, {
    orderNo: '',
    username: '',
    status: '',
    dateRange: []
  })
  pagination.page = 1
  fetchOrderList()
}

// 查看订单详情
const handleView = async (row) => {
  try {
    const response = await getOrderById(row.id)
    currentOrder.value = response.data
    detailDialogVisible.value = true
  } catch (error) {
    ElMessage.error('获取订单详情失败')
  }
}

// 发货
const handleShip = async (row) => {
  try {
    await ElMessageBox.confirm('确定要发货吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    row.status = 'shipped'
    ElMessage.success('发货成功')
  } catch (error) {
    // 用户取消
  }
}

// 取消订单
const handleCancel = async (row) => {
  try {
    await ElMessageBox.confirm('确定要取消该订单吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await deleteOrder(row.id)
    ElMessage.success('订单已取消')
    fetchOrderList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('取消订单失败')
    }
  }
}

// 导出订单
const handleExport = () => {
  ElMessage.success('导出功能开发中...')
}

// 分页相关
const handleSizeChange = (size) => {
  pagination.size = size
  fetchOrderList()
}

const handleCurrentChange = (page) => {
  pagination.page = page
  fetchOrderList()
}

// 获取订单列表
const fetchOrderList = async () => {
  loading.value = true
  try {
    const response = await getOrderList({
      page: pagination.page - 1, // 后端从0开始
      size: pagination.size,
      ...searchForm
    })
    tableData.value = response.data || []
    pagination.total = response.data?.length || 0
  } catch (error) {
    ElMessage.error('获取订单列表失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchOrderList()
})
</script>

<style scoped>
.order-list {
  max-width: 1400px;
  margin: 0 auto;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.product-item {
  display: flex;
  align-items: center;
  font-size: 12px;
}

.amount {
  font-weight: 600;
  color: #f56c6c;
}

.order-detail {
  max-height: 600px;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .product-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .product-item img {
    margin-right: 0 !important;
  }
}
</style>