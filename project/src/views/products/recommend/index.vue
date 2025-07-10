<template>
  <div class="product-recommend">
    <div class="page-card">
      <div class="page-header">
        <h2>推荐商品</h2>
        <el-button type="primary" @click="handleBatchRecommend">
          <el-icon><Star /></el-icon>
          批量推荐
        </el-button>
      </div>

      <!-- 推荐统计 -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon recommend-icon">
            <el-icon><Star /></el-icon>
          </div>
          <div class="stat-content">
            <h3>推荐商品总数</h3>
            <p class="stat-number">{{ recommendStats.total }}</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon hot-icon">
            <el-icon><TrendCharts /></el-icon>
          </div>
          <div class="stat-content">
            <h3>热门推荐</h3>
            <p class="stat-number">{{ recommendStats.hot }}</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon new-icon">
            <el-icon><Plus /></el-icon>
          </div>
          <div class="stat-content">
            <h3>新品推荐</h3>
            <p class="stat-number">{{ recommendStats.new }}</p>
          </div>
        </div>
      </div>

      <!-- 搜索区域 -->
      <div class="search-section">
        <el-form :model="searchForm" inline>
          <el-form-item label="商品名称">
            <el-input
              v-model="searchForm.name"
              placeholder="请输入商品名称"
              clearable
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="推荐类型">
            <el-select v-model="searchForm.type" placeholder="请选择推荐类型" clearable style="width: 150px">
              <el-option label="热门推荐" value="hot" />
              <el-option label="新品推荐" value="new" />
              <el-option label="特价推荐" value="sale" />
              <el-option label="编辑推荐" value="editor" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 120px">
              <el-option label="推荐中" :value="1" />
              <el-option label="已停止" :value="0" />
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
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="productName" label="商品名称" min-width="150" />
          <el-table-column prop="productImage" label="商品图片" width="100">
            <template #default="{ row }">
              <el-image
                :src="row.productImage"
                style="width: 60px; height: 60px"
                fit="cover"
              />
            </template>
          </el-table-column>
          <el-table-column prop="type" label="推荐类型" width="120">
            <template #default="{ row }">
              <el-tag :type="getTypeColor(row.type)">
                {{ getTypeName(row.type) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="priority" label="优先级" width="100">
            <template #default="{ row }">
              <el-rate v-model="row.priority" :max="5" disabled />
            </template>
          </el-table-column>
          <el-table-column prop="clickCount" label="点击量" width="100" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="row.status === 1 ? 'success' : 'danger'">
                {{ row.status === 1 ? '推荐中' : '已停止' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="startTime" label="开始时间" width="160" />
          <el-table-column prop="endTime" label="结束时间" width="160" />
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" size="small" @click="handleEdit(row)">
                编辑
              </el-button>
              <el-button
                :type="row.status === 1 ? 'warning' : 'success'"
                size="small"
                @click="handleToggleStatus(row)"
              >
                {{ row.status === 1 ? '停止' : '启用' }}
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

    <!-- 推荐表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="700px"
      @close="handleDialogClose"
    >
      <el-form
        ref="recommendFormRef"
        :model="recommendForm"
        :rules="recommendRules"
        label-width="100px"
      >
        <el-form-item label="商品" prop="productId">
          <el-select v-model="recommendForm.productId" placeholder="请选择商品" filterable>
            <el-option
              v-for="product in productList"
              :key="product.id"
              :label="product.name"
              :value="product.id"
            />
          </el-select>
        </el-form-item>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="推荐类型" prop="type">
              <el-select v-model="recommendForm.type" placeholder="请选择推荐类型">
                <el-option label="热门推荐" value="hot" />
                <el-option label="新品推荐" value="new" />
                <el-option label="特价推荐" value="sale" />
                <el-option label="编辑推荐" value="editor" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="优先级" prop="priority">
              <el-rate v-model="recommendForm.priority" :max="5" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="开始时间" prop="startTime">
              <el-date-picker
                v-model="recommendForm.startTime"
                type="datetime"
                placeholder="选择开始时间"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束时间" prop="endTime">
              <el-date-picker
                v-model="recommendForm.endTime"
                type="datetime"
                placeholder="选择结束时间"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="推荐理由" prop="reason">
          <el-input
            v-model="recommendForm.reason"
            type="textarea"
            :rows="3"
            placeholder="请输入推荐理由"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getProductList } from '@/api/product'

const loading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const recommendFormRef = ref()
const selectedRows = ref([])

const searchForm = reactive({
  name: '',
  type: '',
  status: ''
})

const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

const recommendStats = reactive({
  total: 15,
  hot: 8,
  new: 5
})

const tableData = ref([
  {
    id: 1,
    productId: 1,
    productName: 'iPhone 15 Pro',
    productImage: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1',
    type: 'hot',
    priority: 5,
    clickCount: 1250,
    status: 1,
    startTime: '2024-01-01 00:00:00',
    endTime: '2024-12-31 23:59:59',
    reason: '最新款iPhone，性能强劲，用户反馈极佳'
  },
  {
    id: 2,
    productId: 2,
    productName: '运动T恤',
    productImage: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1',
    type: 'new',
    priority: 4,
    clickCount: 680,
    status: 1,
    startTime: '2024-01-15 00:00:00',
    endTime: '2024-06-15 23:59:59',
    reason: '新款运动服装，舒适透气'
  }
])

const productList = ref([
  { id: 1, name: 'iPhone 15 Pro' },
  { id: 2, name: '运动T恤' },
  { id: 3, name: '有机苹果' }
])

const recommendForm = reactive({
  id: '',
  productId: '',
  type: '',
  priority: 3,
  startTime: '',
  endTime: '',
  reason: ''
})

const recommendRules = {
  productId: [
    { required: true, message: '请选择商品', trigger: 'change' }
  ],
  type: [
    { required: true, message: '请选择推荐类型', trigger: 'change' }
  ],
  startTime: [
    { required: true, message: '请选择开始时间', trigger: 'change' }
  ],
  endTime: [
    { required: true, message: '请选择结束时间', trigger: 'change' }
  ]
}

const dialogTitle = ref('新增推荐')

// 获取推荐类型名称
const getTypeName = (type) => {
  const typeMap = {
    hot: '热门推荐',
    new: '新品推荐',
    sale: '特价推荐',
    editor: '编辑推荐'
  }
  return typeMap[type] || '未知'
}

// 获取推荐类型颜色
const getTypeColor = (type) => {
  const colorMap = {
    hot: 'danger',
    new: 'success',
    sale: 'warning',
    editor: 'primary'
  }
  return colorMap[type] || 'default'
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  fetchRecommendList()
}

// 重置搜索
const handleReset = () => {
  Object.assign(searchForm, {
    name: '',
    type: '',
    status: ''
  })
  pagination.page = 1
  fetchRecommendList()
}

// 新增推荐
const handleAdd = () => {
  isEdit.value = false
  dialogTitle.value = '新增推荐'
  resetRecommendForm()
  dialogVisible.value = true
}

// 批量推荐
const handleBatchRecommend = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要操作的推荐')
    return
  }
  ElMessage.success(`批量操作 ${selectedRows.value.length} 个推荐`)
}

// 编辑推荐
const handleEdit = (row) => {
  isEdit.value = true
  dialogTitle.value = '编辑推荐'
  Object.assign(recommendForm, {
    ...row,
    startTime: new Date(row.startTime),
    endTime: new Date(row.endTime)
  })
  dialogVisible.value = true
}

// 切换推荐状态
const handleToggleStatus = async (row) => {
  const action = row.status === 1 ? '停止' : '启用'
  try {
    await ElMessageBox.confirm(`确定要${action}该推荐吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    row.status = row.status === 1 ? 0 : 1
    ElMessage.success(`${action}成功`)
  } catch (error) {
    // 用户取消
  }
}

// 删除推荐
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除该推荐吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    const index = tableData.value.findIndex(item => item.id === row.id)
    if (index > -1) {
      tableData.value.splice(index, 1)
      pagination.total--
      recommendStats.total--
    }
    ElMessage.success('删除成功')
  } catch (error) {
    // 用户取消
  }
}

// 选择变化
const handleSelectionChange = (selection) => {
  selectedRows.value = selection
}

// 提交表单
const handleSubmit = () => {
  recommendFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (isEdit.value) {
          const index = tableData.value.findIndex(item => item.id === recommendForm.id)
          if (index > -1) {
            const product = productList.value.find(p => p.id === recommendForm.productId)
            Object.assign(tableData.value[index], {
              ...recommendForm,
              productName: product?.name || '',
              startTime: recommendForm.startTime.toLocaleString(),
              endTime: recommendForm.endTime.toLocaleString()
            })
          }
          ElMessage.success('更新成功')
        } else {
          const product = productList.value.find(p => p.id === recommendForm.productId)
          const newRecommend = {
            ...recommendForm,
            id: Date.now(),
            productName: product?.name || '',
            productImage: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1',
            clickCount: 0,
            status: 1,
            startTime: recommendForm.startTime.toLocaleString(),
            endTime: recommendForm.endTime.toLocaleString()
          }
          tableData.value.unshift(newRecommend)
          pagination.total++
          recommendStats.total++
          ElMessage.success('创建成功')
        }
        dialogVisible.value = false
      } catch (error) {
        ElMessage.error('操作失败')
      }
    }
  })
}

// 关闭对话框
const handleDialogClose = () => {
  resetRecommendForm()
}

// 重置推荐表单
const resetRecommendForm = () => {
  Object.assign(recommendForm, {
    id: '',
    productId: '',
    type: '',
    priority: 3,
    startTime: '',
    endTime: '',
    reason: ''
  })
  recommendFormRef.value?.resetFields()
}

// 分页相关
const handleSizeChange = (size) => {
  pagination.size = size
  fetchRecommendList()
}

const handleCurrentChange = (page) => {
  pagination.page = page
  fetchRecommendList()
}

// 获取推荐列表
const fetchRecommendList = () => {
  loading.value = true
  setTimeout(() => {
    pagination.total = tableData.value.length
    loading.value = false
  }, 500)
}

// 获取商品列表用于选择
const fetchProductList = async () => {
  try {
    const response = await getProductList({ size: 100 })
    if (response.data && response.data.content) {
      productList.value = response.data.content.map(item => ({
        id: item.id,
        name: item.name
      }))
    } else if (response.data) {
      productList.value = response.data.map(item => ({
        id: item.id,
        name: item.name
      }))
    }
  } catch (error) {
    console.log('获取商品列表失败:', error)
  }
}

onMounted(() => {
  fetchRecommendList()
  fetchProductList()
})
</script>

<style scoped>
.product-recommend {
  max-width: 1400px;
  margin: 0 auto;
}

.recommend-icon { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
.hot-icon { background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%); }
.new-icon { background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); }

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
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #333;
}
</style>