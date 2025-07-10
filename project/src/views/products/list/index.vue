<template>
  <div class="product-list">
    <div class="page-card">
      <div class="page-header">
        <h2>商品列表</h2>
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          新增商品
        </el-button>
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
          <el-form-item label="分类">
            <el-select v-model="searchForm.category" placeholder="请选择分类" clearable style="width: 150px">
              <el-option label="电子产品" value="electronics" />
              <el-option label="服装" value="clothing" />
              <el-option label="食品" value="food" />
              <el-option label="图书" value="books" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 120px">
              <el-option label="上架" :value="1" />
              <el-option label="下架" :value="0" />
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
          <el-table-column prop="name" label="商品名称" min-width="150" />
          <el-table-column prop="image" label="商品图片" width="100">
            <template #default="{ row }">
              <el-image
                :src="row.image"
                :preview-src-list="[row.image]"
                style="width: 60px; height: 60px"
                fit="cover"
              />
            </template>
          </el-table-column>
          <el-table-column prop="category" label="分类" width="100">
            <template #default="{ row }">
              <el-tag :type="getCategoryColor(row.category)">
                {{ getCategoryName(row.category) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="价格" width="100">
            <template #default="{ row }">
              ¥{{ row.price }}
            </template>
          </el-table-column>
          <el-table-column prop="stock" label="库存" width="80" />
          <el-table-column prop="sales" label="销量" width="80" />
          <el-table-column prop="status" label="状态" width="80">
            <template #default="{ row }">
              <el-tag :type="row.status === 1 ? 'success' : 'danger'">
                {{ row.status === 1 ? '上架' : '下架' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="160" />
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
                {{ row.status === 1 ? '下架' : '上架' }}
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

    <!-- 商品表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="800px"
      @close="handleDialogClose"
    >
      <el-form
        ref="productFormRef"
        :model="productForm"
        :rules="productRules"
        label-width="100px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="商品名称" prop="name">
              <el-input v-model="productForm.name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分类" prop="category">
              <el-select v-model="productForm.category" placeholder="请选择分类">
                <el-option label="电子产品" value="electronics" />
                <el-option label="服装" value="clothing" />
                <el-option label="食品" value="food" />
                <el-option label="图书" value="books" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="价格" prop="price">
              <el-input-number v-model="productForm.price" :min="0" :precision="2" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="库存" prop="stock">
              <el-input-number v-model="productForm.stock" :min="0" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="商品图片" prop="image">
          <el-input v-model="productForm.image" placeholder="请输入图片URL" />
        </el-form-item>
        
        <el-form-item label="商品描述" prop="description">
          <el-input
            v-model="productForm.description"
            type="textarea"
            :rows="4"
            placeholder="请输入商品描述"
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
import { getProductList, getProductById, createProduct, updateProduct, deleteProduct } from '@/api/product'

const loading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const productFormRef = ref()

const searchForm = reactive({
  name: '',
  category: '',
  status: ''
})

const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

const tableData = ref([])

const productForm = reactive({
  id: '',
  name: '',
  category: '',
  price: 0,
  stock: 0,
  image: '',
  description: ''
})

const productRules = {
  name: [
    { required: true, message: '请输入商品名称', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择分类', trigger: 'change' }
  ],
  price: [
    { required: true, message: '请输入价格', trigger: 'blur' }
  ],
  stock: [
    { required: true, message: '请输入库存', trigger: 'blur' }
  ]
}

const dialogTitle = ref('新增商品')

// 获取分类名称
const getCategoryName = (category) => {
  const categoryMap = {
    electronics: '电子产品',
    clothing: '服装',
    food: '食品',
    books: '图书'
  }
  return categoryMap[category] || '未知'
}

// 获取分类颜色
const getCategoryColor = (category) => {
  const colorMap = {
    electronics: 'primary',
    clothing: 'success',
    food: 'warning',
    books: 'info'
  }
  return colorMap[category] || 'default'
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  fetchProductList()
}

// 重置搜索
const handleReset = () => {
  Object.assign(searchForm, {
    name: '',
    category: '',
    status: ''
  })
  pagination.page = 1
  fetchProductList()
}

// 新增商品
const handleAdd = () => {
  isEdit.value = false
  dialogTitle.value = '新增商品'
  resetProductForm()
  dialogVisible.value = true
}

// 编辑商品
const handleEdit = (row) => {
  isEdit.value = true
  dialogTitle.value = '编辑商品'
  Object.assign(productForm, row)
  dialogVisible.value = true
}

// 切换商品状态
const handleToggleStatus = async (row) => {
  const action = row.status === 1 ? '下架' : '上架'
  try {
    await ElMessageBox.confirm(`确定要${action}该商品吗？`, '提示', {
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

// 删除商品
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除该商品吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await deleteProduct(row.id)
    ElMessage.success('删除成功')
    fetchProductList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 提交表单
const handleSubmit = () => {
  productFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (isEdit.value) {
          await updateProduct(productForm.id, productForm)
          ElMessage.success('更新成功')
        } else {
          await createProduct(productForm)
          ElMessage.success('创建成功')
        }
        dialogVisible.value = false
        fetchProductList()
      } catch (error) {
        ElMessage.error('操作失败')
      }
    }
  })
}

// 关闭对话框
const handleDialogClose = () => {
  resetProductForm()
}

// 重置商品表单
const resetProductForm = () => {
  Object.assign(productForm, {
    id: '',
    name: '',
    category: '',
    price: 0,
    stock: 0,
    image: '',
    description: ''
  })
  productFormRef.value?.resetFields()
}

// 分页相关
const handleSizeChange = (size) => {
  pagination.size = size
  fetchProductList()
}

const handleCurrentChange = (page) => {
  pagination.page = page
  fetchProductList()
}

// 获取商品列表
const fetchProductList = async () => {
  loading.value = true
  try {
    const response = await getProductList({
      page: pagination.page - 1, // 后端从0开始
      size: pagination.size,
      name: searchForm.name
    })
    
    // 处理分页数据
    if (response.data && response.data.content) {
      tableData.value = response.data.content
      pagination.total = response.data.totalElements
    } else {
      tableData.value = response.data || []
      pagination.total = response.data?.length || 0
    }
  } catch (error) {
    ElMessage.error('获取商品列表失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchProductList()
})
</script>

<style scoped>
.product-list {
  max-width: 1400px;
  margin: 0 auto;
}
</style>