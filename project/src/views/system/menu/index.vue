<template>
  <div class="menu-management">
    <div class="page-card">
      <div class="page-header">
        <h2>菜单管理</h2>
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          新增菜单
        </el-button>
      </div>

      <!-- 表格区域 -->
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        row-key="id"
        border
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column prop="title" label="菜单名称" width="200" />
        <el-table-column prop="icon" label="图标" width="80">
          <template #default="{ row }">
            <el-icon v-if="row.icon">
              <component :is="row.icon" />
            </el-icon>
          </template>
        </el-table-column>
        <el-table-column prop="path" label="路径" />
        <el-table-column prop="component" label="组件" />
        <el-table-column prop="sort" label="排序" width="80" />
        <el-table-column prop="type" label="类型" width="80">
          <template #default="{ row }">
            <el-tag :type="getTypeColor(row.type)">
              {{ getTypeName(row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button type="success" size="small" @click="handleAddChild(row)">
              新增
            </el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 菜单表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="700px"
      @close="handleDialogClose"
    >
      <el-form
        ref="menuFormRef"
        :model="menuForm"
        :rules="menuRules"
        label-width="100px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="菜单类型" prop="type">
              <el-radio-group v-model="menuForm.type">
                <el-radio :label="1">目录</el-radio>
                <el-radio :label="2">菜单</el-radio>
                <el-radio :label="3">按钮</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上级菜单" prop="parentId">
              <el-tree-select
                v-model="menuForm.parentId"
                :data="menuTreeData"
                :props="{ value: 'id', label: 'title', children: 'children' }"
                placeholder="选择上级菜单"
                clearable
                check-strictly
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="title">
              <el-input v-model="menuForm.title" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单图标" prop="icon">
              <el-select v-model="menuForm.icon" placeholder="选择图标" clearable>
                <el-option
                  v-for="icon in iconList"
                  :key="icon"
                  :label="icon"
                  :value="icon"
                >
                  <el-icon><component :is="icon" /></el-icon>
                  {{ icon }}
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20" v-if="menuForm.type !== 3">
          <el-col :span="12">
            <el-form-item label="路由地址" prop="path">
              <el-input v-model="menuForm.path" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="组件路径" prop="component">
              <el-input v-model="menuForm.component" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="排序" prop="sort">
              <el-input-number v-model="menuForm.sort" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="menuForm.status">
                <el-radio :label="1">启用</el-radio>
                <el-radio :label="0">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item v-if="menuForm.type === 3" label="权限标识" prop="permission">
          <el-input v-model="menuForm.permission" />
        </el-form-item>
        
        <el-form-item label="是否隐藏" prop="hidden">
          <el-radio-group v-model="menuForm.hidden">
            <el-radio :label="false">显示</el-radio>
            <el-radio :label="true">隐藏</el-radio>
          </el-radio-group>
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
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const menuFormRef = ref()

// 图标列表
const iconList = [
  'House', 'User', 'Setting', 'Menu', 'Document', 'Folder',
  'Monitor', 'DataLine', 'PieChart', 'ShoppingCart', 'Money'
]

const tableData = ref([
  {
    id: 1,
    title: '系统管理',
    icon: 'Setting',
    path: '/system',
    component: 'Layout',
    type: 1,
    sort: 1,
    status: 1,
    hidden: false,
    parentId: 0,
    children: [
      {
        id: 11,
        title: '用户管理',
        icon: 'User',
        path: '/system/user',
        component: 'system/user/index',
        type: 2,
        sort: 1,
        status: 1,
        hidden: false,
        parentId: 1,
        children: [
          {
            id: 111,
            title: '新增用户',
            icon: '',
            path: '',
            component: '',
            type: 3,
            sort: 1,
            status: 1,
            hidden: false,
            parentId: 11,
            permission: 'system:user:add'
          }
        ]
      },
      {
        id: 12,
        title: '角色管理',
        icon: 'UserFilled',
        path: '/system/role',
        component: 'system/role/index',
        type: 2,
        sort: 2,
        status: 1,
        hidden: false,
        parentId: 1
      }
    ]
  }
])

const menuForm = reactive({
  id: '',
  title: '',
  icon: '',
  path: '',
  component: '',
  type: 1,
  sort: 0,
  status: 1,
  hidden: false,
  parentId: 0,
  permission: ''
})

const menuRules = {
  title: [
    { required: true, message: '请输入菜单名称', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择菜单类型', trigger: 'change' }
  ]
}

const dialogTitle = ref('新增菜单')

// 菜单树数据（用于选择上级菜单）
const menuTreeData = computed(() => {
  const tree = [{ id: 0, title: '顶级菜单', children: [] }]
  
  const buildTree = (data, parentId = 0) => {
    return data
      .filter(item => item.parentId === parentId && item.type !== 3)
      .map(item => ({
        id: item.id,
        title: item.title,
        children: buildTree(data, item.id)
      }))
  }
  
  tree[0].children = buildTree(tableData.value)
  return tree
})

// 获取类型名称
const getTypeName = (type) => {
  const typeMap = { 1: '目录', 2: '菜单', 3: '按钮' }
  return typeMap[type] || '未知'
}

// 获取类型颜色
const getTypeColor = (type) => {
  const colorMap = { 1: 'primary', 2: 'success', 3: 'warning' }
  return colorMap[type] || 'info'
}

// 新增菜单
const handleAdd = () => {
  isEdit.value = false
  dialogTitle.value = '新增菜单'
  resetMenuForm()
  dialogVisible.value = true
}

// 新增子菜单
const handleAddChild = (row) => {
  isEdit.value = false
  dialogTitle.value = '新增子菜单'
  resetMenuForm()
  menuForm.parentId = row.id
  dialogVisible.value = true
}

// 编辑菜单
const handleEdit = (row) => {
  isEdit.value = true
  dialogTitle.value = '编辑菜单'
  Object.assign(menuForm, row)
  dialogVisible.value = true
}

// 删除菜单
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除该菜单吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    // 递归删除菜单及其子菜单
    const deleteMenu = (data, id) => {
      for (let i = data.length - 1; i >= 0; i--) {
        if (data[i].id === id) {
          data.splice(i, 1)
          return true
        }
        if (data[i].children && deleteMenu(data[i].children, id)) {
          return true
        }
      }
      return false
    }
    
    deleteMenu(tableData.value, row.id)
    ElMessage.success('删除成功')
  } catch (error) {
    // 用户取消
  }
}

// 提交表单
const handleSubmit = () => {
  menuFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (isEdit.value) {
          // 更新菜单
          const updateMenu = (data, menu) => {
            for (let item of data) {
              if (item.id === menu.id) {
                Object.assign(item, menu)
                return true
              }
              if (item.children && updateMenu(item.children, menu)) {
                return true
              }
            }
            return false
          }
          
          updateMenu(tableData.value, menuForm)
          ElMessage.success('更新成功')
        } else {
          // 新增菜单
          const newMenu = {
            ...menuForm,
            id: Date.now(),
            children: []
          }
          
          if (newMenu.parentId === 0) {
            tableData.value.push(newMenu)
          } else {
            // 找到父菜单并添加子菜单
            const addToParent = (data, parentId, menu) => {
              for (let item of data) {
                if (item.id === parentId) {
                  if (!item.children) item.children = []
                  item.children.push(menu)
                  return true
                }
                if (item.children && addToParent(item.children, parentId, menu)) {
                  return true
                }
              }
              return false
            }
            
            addToParent(tableData.value, newMenu.parentId, newMenu)
          }
          
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
  resetMenuForm()
}

// 重置菜单表单
const resetMenuForm = () => {
  Object.assign(menuForm, {
    id: '',
    title: '',
    icon: '',
    path: '',
    component: '',
    type: 1,
    sort: 0,
    status: 1,
    hidden: false,
    parentId: 0,
    permission: ''
  })
  menuFormRef.value?.resetFields()
}

onMounted(() => {
  // 初始化数据
})
</script>

<style scoped>
.menu-management {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
}
</style>