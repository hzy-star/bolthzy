<template>
  <div class="user-actions">
    <div class="page-card">
      <div class="page-header">
        <h2>用户行为日志</h2>
        <el-button type="primary" @click="handleExport">
          <el-icon><Download /></el-icon>
          导出日志
        </el-button>
      </div>

      <!-- 统计卡片 -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon login-icon">
            <el-icon><User /></el-icon>
          </div>
          <div class="stat-content">
            <h3>今日登录</h3>
            <p class="stat-number">{{ actionStats.todayLogin }}</p>
            <span class="stat-trend positive">+12%</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon view-icon">
            <el-icon><View /></el-icon>
          </div>
          <div class="stat-content">
            <h3>今日浏览</h3>
            <p class="stat-number">{{ actionStats.todayView }}</p>
            <span class="stat-trend positive">+8%</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon purchase-icon">
            <el-icon><ShoppingCart /></el-icon>
          </div>
          <div class="stat-content">
            <h3>今日购买</h3>
            <p class="stat-number">{{ actionStats.todayPurchase }}</p>
            <span class="stat-trend negative">-3%</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon active-icon">
            <el-icon><TrendCharts /></el-icon>
          </div>
          <div class="stat-content">
            <h3>活跃用户</h3>
            <p class="stat-number">{{ actionStats.activeUsers }}</p>
            <span class="stat-trend positive">+15%</span>
          </div>
        </div>
      </div>

      <!-- 搜索区域 -->
      <div class="search-section">
        <el-form :model="searchForm" inline>
          <el-form-item label="用户ID">
            <el-input
              v-model="searchForm.userId"
              placeholder="请输入用户ID"
              clearable
              style="width: 150px"
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
          <el-form-item label="行为类型">
            <el-select v-model="searchForm.action" placeholder="请选择行为类型" clearable style="width: 150px">
              <el-option label="登录" value="登录" />
              <el-option label="登出" value="登出" />
              <el-option label="浏览商品" value="浏览商品" />
              <el-option label="加入购物车" value="加入购物车" />
              <el-option label="下单" value="下单" />
              <el-option label="支付" value="支付" />
            </el-select>
          </el-form-item>
          <el-form-item label="时间范围">
            <el-date-picker
              v-model="searchForm.dateRange"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              style="width: 350px"
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
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="userId" label="用户ID" width="100" />
          <el-table-column prop="username" label="用户名" width="120" />
          <el-table-column prop="action" label="行为类型" width="120">
            <template #default="{ row }">
              <el-tag :type="getActionColor(row.action)">
                {{ row.action }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="productId" label="商品ID" width="100">
            <template #default="{ row }">
              <span v-if="row.productId">{{ row.productId }}</span>
              <span v-else class="text-muted">-</span>
            </template>
          </el-table-column>
          <el-table-column prop="productName" label="商品名称" min-width="150">
            <template #default="{ row }">
              <span v-if="row.productName">{{ row.productName }}</span>
              <span v-else class="text-muted">-</span>
            </template>
          </el-table-column>
          <el-table-column prop="ip" label="IP地址" width="140" />
          <el-table-column prop="userAgent" label="设备信息" min-width="200">
            <template #default="{ row }">
              <el-tooltip :content="row.userAgent" placement="top">
                <span class="text-ellipsis">{{ row.userAgent }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="actionTime" label="操作时间" width="160" />
          <el-table-column label="操作" width="120" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" size="small" @click="handleView(row)">
                详情
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

    <!-- 行为详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="行为详情"
      width="600px"
    >
      <div v-if="currentAction" class="action-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="行为ID">{{ currentAction.id }}</el-descriptions-item>
          <el-descriptions-item label="用户ID">{{ currentAction.userId }}</el-descriptions-item>
          <el-descriptions-item label="用户名">{{ currentAction.username }}</el-descriptions-item>
          <el-descriptions-item label="行为类型">
            <el-tag :type="getActionColor(currentAction.action)">
              {{ currentAction.action }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="商品ID">
            {{ currentAction.productId || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="商品名称">
            {{ currentAction.productName || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="IP地址">{{ currentAction.ip }}</el-descriptions-item>
          <el-descriptions-item label="操作时间">{{ currentAction.actionTime }}</el-descriptions-item>
          <el-descriptions-item label="设备信息" :span="2">
            {{ currentAction.userAgent }}
          </el-descriptions-item>
          <el-descriptions-item label="额外信息" :span="2">
            <pre>{{ JSON.stringify(currentAction.extra, null, 2) }}</pre>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const detailDialogVisible = ref(false)
const currentAction = ref(null)

const searchForm = reactive({
  userId: '',
  username: '',
  action: '',
  dateRange: []
})

const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

const actionStats = reactive({
  todayLogin: 156,
  todayView: 2340,
  todayPurchase: 89,
  activeUsers: 1205
})

const tableData = ref([
  {
    id: 1,
    userId: 1,
    username: '张三',
    action: '登录',
    productId: null,
    productName: null,
    ip: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    actionTime: '2024-01-01 09:30:15',
    extra: {
      loginType: 'password',
      device: 'PC'
    }
  },
  {
    id: 2,
    userId: 1,
    username: '张三',
    action: '浏览商品',
    productId: 1,
    productName: 'iPhone 15 Pro',
    ip: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    actionTime: '2024-01-01 09:32:20',
    extra: {
      duration: 120,
      source: 'search'
    }
  },
  {
    id: 3,
    userId: 2,
    username: '李四',
    action: '加入购物车',
    productId: 2,
    productName: '运动T恤',
    ip: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
    actionTime: '2024-01-01 10:15:30',
    extra: {
      quantity: 2,
      price: 199.00
    }
  },
  {
    id: 4,
    userId: 3,
    username: '王五',
    action: '下单',
    productId: 1,
    productName: 'iPhone 15 Pro',
    ip: '192.168.1.102',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    actionTime: '2024-01-01 11:20:45',
    extra: {
      orderId: 'ORD202401010001',
      amount: 8999.00
    }
  },
  {
    id: 5,
    userId: 1,
    username: '张三',
    action: '登出',
    productId: null,
    productName: null,
    ip: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    actionTime: '2024-01-01 12:00:00',
    extra: {
      sessionDuration: 1800
    }
  }
])

// 获取行为类型颜色
const getActionColor = (action) => {
  const colorMap = {
    '登录': 'success',
    '登出': 'info',
    '浏览商品': 'primary',
    '加入购物车': 'warning',
    '下单': 'danger',
    '支付': 'success'
  }
  return colorMap[action] || 'default'
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  fetchActionList()
}

// 重置搜索
const handleReset = () => {
  Object.assign(searchForm, {
    userId: '',
    username: '',
    action: '',
    dateRange: []
  })
  pagination.page = 1
  fetchActionList()
}

// 查看详情
const handleView = (row) => {
  currentAction.value = row
  detailDialogVisible.value = true
}

// 导出日志
const handleExport = () => {
  ElMessage.success('导出功能开发中...')
}

// 分页相关
const handleSizeChange = (size) => {
  pagination.size = size
  fetchActionList()
}

const handleCurrentChange = (page) => {
  pagination.page = page
  fetchActionList()
}

// 获取行为日志列表
const fetchActionList = () => {
  loading.value = true
  setTimeout(() => {
    pagination.total = tableData.value.length
    loading.value = false
  }, 500)
}

onMounted(() => {
  fetchActionList()
})
</script>

<style scoped>
.user-actions {
  max-width: 1400px;
  margin: 0 auto;
}

.login-icon { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.view-icon { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
.purchase-icon { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
.active-icon { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #fff;
}

.stat-content h3 {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.stat-number {
  margin: 0 0 4px 0;
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.stat-trend {
  font-size: 12px;
  font-weight: 500;
}

.stat-trend.positive { color: #52c41a; }
.stat-trend.negative { color: #ff4d4f; }

.text-muted {
  color: #999;
}

.text-ellipsis {
  display: inline-block;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: top;
}

.action-detail pre {
  background: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  font-size: 12px;
  max-height: 200px;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .text-ellipsis {
    max-width: 100px;
  }
  
  .search-section .el-form {
    flex-direction: column;
    gap: 10px;
  }
  
  .search-section .el-form-item {
    width: 100%;
  }
  
  .search-section .el-date-picker {
    width: 100% !important;
  }
}
</style>