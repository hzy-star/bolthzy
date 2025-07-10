<template>
  <div class="order-stats">
    <div class="page-card">
      <div class="page-header">
        <h2>订单统计</h2>
        <el-button type="primary" @click="handleRefresh">
          <el-icon><Refresh /></el-icon>
          刷新数据
        </el-button>
      </div>

      <!-- 统计卡片 -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon total-icon">
            <el-icon><ShoppingCart /></el-icon>
          </div>
          <div class="stat-content">
            <h3>总订单数</h3>
            <p class="stat-number">{{ orderStats.total }}</p>
            <span class="stat-trend positive">+12%</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon revenue-icon">
            <el-icon><Money /></el-icon>
          </div>
          <div class="stat-content">
            <h3>总收入</h3>
            <p class="stat-number">¥{{ orderStats.revenue.toLocaleString() }}</p>
            <span class="stat-trend positive">+8%</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon pending-icon">
            <el-icon><Clock /></el-icon>
          </div>
          <div class="stat-content">
            <h3>待处理订单</h3>
            <p class="stat-number">{{ orderStats.pending }}</p>
            <span class="stat-trend negative">-3%</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon completed-icon">
            <el-icon><Check /></el-icon>
          </div>
          <div class="stat-content">
            <h3>已完成订单</h3>
            <p class="stat-number">{{ orderStats.completed }}</p>
            <span class="stat-trend positive">+15%</span>
          </div>
        </div>
      </div>

      <!-- 时间筛选 -->
      <div class="filter-section">
        <el-form :model="filterForm" inline>
          <el-form-item label="时间范围">
            <el-date-picker
              v-model="filterForm.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="handleDateChange"
            />
          </el-form-item>
          <el-form-item label="统计维度">
            <el-select v-model="filterForm.dimension" @change="handleDimensionChange">
              <el-option label="按天" value="day" />
              <el-option label="按周" value="week" />
              <el-option label="按月" value="month" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>

      <!-- 图表区域 -->
      <div class="charts-section">
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="chart-card">
              <h3>订单趋势</h3>
              <div id="orderTrendChart" class="chart-container"></div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="chart-card">
              <h3>订单状态分布</h3>
              <div id="orderStatusChart" class="chart-container"></div>
            </div>
          </el-col>
        </el-row>

        <el-row :gutter="20" style="margin-top: 20px">
          <el-col :span="12">
            <div class="chart-card">
              <h3>支付方式分布</h3>
              <div id="paymentChart" class="chart-container"></div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="chart-card">
              <h3>热销商品TOP10</h3>
              <div class="top-products">
                <div 
                  v-for="(product, index) in topProducts" 
                  :key="product.id"
                  class="product-rank-item"
                >
                  <div class="rank-number" :class="getRankClass(index)">{{ index + 1 }}</div>
                  <el-image
                    :src="product.image"
                    style="width: 40px; height: 40px"
                    fit="cover"
                  />
                  <div class="product-info">
                    <div class="product-name">{{ product.name }}</div>
                    <div class="product-sales">销量: {{ product.sales }}</div>
                  </div>
                  <div class="product-revenue">¥{{ product.revenue.toLocaleString() }}</div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- 数据表格 -->
      <div class="table-section">
        <h3>详细数据</h3>
        <el-table :data="statsTableData" border>
          <el-table-column prop="date" label="日期" />
          <el-table-column prop="orderCount" label="订单数量" />
          <el-table-column prop="revenue" label="收入金额">
            <template #default="{ row }">¥{{ row.revenue.toLocaleString() }}</template>
          </el-table-column>
          <el-table-column prop="avgOrderValue" label="客单价">
            <template #default="{ row }">¥{{ row.avgOrderValue.toFixed(2) }}</template>
          </el-table-column>
          <el-table-column prop="completionRate" label="完成率">
            <template #default="{ row }">{{ (row.completionRate * 100).toFixed(1) }}%</template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'

const filterForm = reactive({
  dateRange: [],
  dimension: 'day'
})

const orderStats = reactive({
  total: 1234,
  revenue: 567890,
  pending: 45,
  completed: 1089
})

const topProducts = ref([
  {
    id: 1,
    name: 'iPhone 15 Pro',
    image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1',
    sales: 120,
    revenue: 1079880
  },
  {
    id: 2,
    name: '运动T恤',
    image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1',
    sales: 85,
    revenue: 16915
  },
  {
    id: 3,
    name: '有机苹果',
    image: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1',
    sales: 45,
    revenue: 1125
  }
])

const statsTableData = ref([
  {
    date: '2024-01-01',
    orderCount: 45,
    revenue: 12580,
    avgOrderValue: 279.56,
    completionRate: 0.89
  },
  {
    date: '2024-01-02',
    orderCount: 52,
    revenue: 15420,
    avgOrderValue: 296.54,
    completionRate: 0.92
  },
  {
    date: '2024-01-03',
    orderCount: 38,
    revenue: 9870,
    avgOrderValue: 259.74,
    completionRate: 0.87
  }
])

// 获取排名样式
const getRankClass = (index) => {
  if (index === 0) return 'rank-first'
  if (index === 1) return 'rank-second'
  if (index === 2) return 'rank-third'
  return 'rank-normal'
}

// 刷新数据
const handleRefresh = () => {
  ElMessage.success('数据已刷新')
  initCharts()
}

// 日期变化
const handleDateChange = () => {
  initCharts()
}

// 维度变化
const handleDimensionChange = () => {
  initCharts()
}

// 初始化图表
const initCharts = () => {
  nextTick(() => {
    // 这里应该使用真实的图表库如 ECharts
    // 由于没有引入图表库，这里只是模拟
    console.log('初始化图表...')
  })
}

onMounted(() => {
  // 设置默认日期范围为最近7天
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - 7)
  filterForm.dateRange = [startDate, endDate]
  
  initCharts()
})
</script>

<style scoped>
.order-stats {
  max-width: 1400px;
  margin: 0 auto;
}

.total-icon { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.revenue-icon { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
.pending-icon { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
.completed-icon { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }

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

.filter-section {
  margin: 20px 0;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.charts-section {
  margin: 20px 0;
}

.chart-card {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.chart-card h3 {
  margin: 0 0 20px 0;
  font-size: 16px;
  color: #333;
}

.chart-container {
  height: 300px;
  background: #f5f5f5;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
}

.top-products {
  max-height: 300px;
  overflow-y: auto;
}

.product-rank-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  gap: 12px;
}

.product-rank-item:last-child {
  border-bottom: none;
}

.rank-number {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  flex-shrink: 0;
}

.rank-first { background: #ffd700; }
.rank-second { background: #c0c0c0; }
.rank-third { background: #cd7f32; }
.rank-normal { background: #999; }

.product-info {
  flex: 1;
  min-width: 0;
}

.product-name {
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-sales {
  font-size: 12px;
  color: #666;
}

.product-revenue {
  font-size: 14px;
  font-weight: 600;
  color: #f56c6c;
  flex-shrink: 0;
}

.table-section {
  margin-top: 30px;
}

.table-section h3 {
  margin: 0 0 15px 0;
  font-size: 16px;
  color: #333;
}

@media (max-width: 768px) {
  .charts-section .el-col {
    margin-bottom: 20px;
  }
  
  .product-rank-item {
    padding: 8px 0;
    gap: 8px;
  }
  
  .rank-number {
    width: 20px;
    height: 20px;
    font-size: 10px;
  }
  
  .product-name {
    font-size: 12px;
  }
  
  .product-sales {
    font-size: 10px;
  }
  
  .product-revenue {
    font-size: 12px;
  }
}
</style>