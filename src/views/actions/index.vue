<template>
  <div class="user-actions">
    <div class="page-card">
      <div class="page-header">
        <h2>用户行为日志</h2>
        <el-button type="primary" @click="handleRefresh">
          <el-icon><Refresh /></el-icon>
          刷新数据
        </el-button>
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
          <el-form-item label="行为类型">
            <el-select v-model="searchForm.action" placeholder="请选择行为类型" clearable style="width: 150px">
              <el-option label="登录" value="登录" />
              <el-option label="登出" value="登出" />
              <el-option label="下单" value="下单" />
            </el-select>
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
          <el-table-column prop="actionTime" label="操作时间" width="180" />
          <el-table-column label="操作" width="120" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" size="small" @click="handleView(row)">
                详情
              </el-button>
              <el-button type="danger" size="small" @click="handleDelete(row)">
                删除
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
          <el-descriptions-item label="行为类型">
            <el-tag :type="getActionColor(currentAction.action)">
              {{ currentAction.action }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="商品ID">
            {{ currentAction.productId || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="操作时间">{{ currentAction.actionTime }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getUserActionList, getUserActionById, deleteUserAction } from '@/api/userAction'

const loading = ref(false)
const detailDialogVisible = ref(false)
const currentAction = ref(null)

const searchForm = reactive({
  userId: '',
  action: ''
})

const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

const tableData = ref([])

// 获取行为类型颜色
const getActionColor = (action) => {
  const colorMap = {
    '登录': 'success',
    '登出': 'info',
    '下单': 'danger'
  }
  return colorMap[action] || 'default'
}

// 获取用户行为列表
const fetchActionList = async () => {
  loading.value = true
  try {
    const response = await getUserActionList({
      ...searchForm
    })
    tableData.value = response.data || []
    pagination.total = response.data?.length || 0
  } catch (error) {
    ElMessage.error('获取用户行为列表失败')
  } finally {
    loading.value = false
  }
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
    action: ''
  })
  pagination.page = 1
  fetchActionList()
}

// 查看详情
const handleView = async (row) => {
  try {
    const response = await getUserActionById(row.id)
    currentAction.value = response.data
    detailDialogVisible.value = true
  } catch (error) {
    ElMessage.error('获取详情失败')
  }
}

// 删除行为记录
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除该行为记录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await deleteUserAction(row.id)
    ElMessage.success('删除成功')
    fetchActionList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 刷新数据
const handleRefresh = () => {
  fetchActionList()
  ElMessage.success('数据已刷新')
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

onMounted(() => {
  fetchActionList()
})
</script>

<style scoped>
.user-actions {
  max-width: 1400px;
  margin: 0 auto;
}

.text-muted {
  color: #999;
}

.action-detail {
  max-height: 400px;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .search-section .el-form {
    flex-direction: column;
    gap: 10px;
  }
  
  .search-section .el-form-item {
    width: 100%;
  }
}
</style>