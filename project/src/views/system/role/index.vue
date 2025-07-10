<template>
  <div class="role-management">
    <div class="page-card">
      <div class="page-header">
        <h2>角色管理</h2>
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          新增角色
        </el-button>
      </div>

      <!-- 表格区域 -->
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        border
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="角色名称" />
        <el-table-column prop="code" label="角色编码" />
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button type="info" size="small" @click="handlePermission(row)">
              权限
            </el-button>
            <el-button
              :type="row.status === 1 ? 'warning' : 'success'"
              size="small"
              @click="handleToggleStatus(row)"
            >
              {{ row.status === 1 ? '禁用' : '启用' }}
            </el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 角色表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      @close="handleDialogClose"
    >
      <el-form
        ref="roleFormRef"
        :model="roleForm"
        :rules="roleRules"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色编码" prop="code">
          <el-input v-model="roleForm.code" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="roleForm.description"
            type="textarea"
            :rows="4"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 权限配置对话框 -->
    <el-dialog
      v-model="permissionDialogVisible"
      title="权限配置"
      width="800px"
    >
      <el-tree
        ref="permissionTreeRef"
        :data="permissionTree"
        :props="treeProps"
        show-checkbox
        node-key="id"
        :default-checked-keys="checkedPermissions"
        class="permission-tree"
      />
      <template #footer>
        <el-button @click="permissionDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSavePermission">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const dialogVisible = ref(false)
const permissionDialogVisible = ref(false)
const isEdit = ref(false)
const roleFormRef = ref()
const permissionTreeRef = ref()

const tableData = ref([
  {
    id: 1,
    name: '超级管理员',
    code: 'admin',
    description: '拥有系统所有权限',
    status: 1,
    createTime: '2024-01-01 10:00:00'
  },
  {
    id: 2,
    name: '普通用户',
    code: 'user',
    description: '普通用户权限',
    status: 1,
    createTime: '2024-01-02 10:00:00'
  }
])

const roleForm = reactive({
  id: '',
  name: '',
  code: '',
  description: ''
})

const roleRules = {
  name: [
    { required: true, message: '请输入角色名称', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入角色编码', trigger: 'blur' }
  ]
}

const dialogTitle = ref('新增角色')
const currentRole = ref(null)
const checkedPermissions = ref([])

// 权限树数据
const permissionTree = ref([
  {
    id: 1,
    label: '系统管理',
    children: [
      {
        id: 11,
        label: '用户管理',
        children: [
          { id: 111, label: '查看用户' },
          { id: 112, label: '新增用户' },
          { id: 113, label: '编辑用户' },
          { id: 114, label: '删除用户' }
        ]
      },
      {
        id: 12,
        label: '角色管理',
        children: [
          { id: 121, label: '查看角色' },
          { id: 122, label: '新增角色' },
          { id: 123, label: '编辑角色' },
          { id: 124, label: '删除角色' }
        ]
      },
      {
        id: 13,
        label: '菜单管理',
        children: [
          { id: 131, label: '查看菜单' },
          { id: 132, label: '新增菜单' },
          { id: 133, label: '编辑菜单' },
          { id: 134, label: '删除菜单' }
        ]
      }
    ]
  }
])

const treeProps = {
  children: 'children',
  label: 'label'
}

// 新增角色
const handleAdd = () => {
  isEdit.value = false
  dialogTitle.value = '新增角色'
  resetRoleForm()
  dialogVisible.value = true
}

// 编辑角色
const handleEdit = (row) => {
  isEdit.value = true
  dialogTitle.value = '编辑角色'
  Object.assign(roleForm, row)
  dialogVisible.value = true
}

// 权限配置
const handlePermission = (row) => {
  currentRole.value = row
  // 模拟获取角色权限
  if (row.code === 'admin') {
    checkedPermissions.value = [111, 112, 113, 114, 121, 122, 123, 124, 131, 132, 133, 134]
  } else {
    checkedPermissions.value = [111, 121, 131]
  }
  permissionDialogVisible.value = true
}

// 切换角色状态
const handleToggleStatus = async (row) => {
  const action = row.status === 1 ? '禁用' : '启用'
  try {
    await ElMessageBox.confirm(`确定要${action}该角色吗？`, '提示', {
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

// 删除角色
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除该角色吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    const index = tableData.value.findIndex(item => item.id === row.id)
    if (index > -1) {
      tableData.value.splice(index, 1)
    }
    ElMessage.success('删除成功')
  } catch (error) {
    // 用户取消
  }
}

// 提交表单
const handleSubmit = () => {
  roleFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (isEdit.value) {
          // 更新角色
          const index = tableData.value.findIndex(item => item.id === roleForm.id)
          if (index > -1) {
            Object.assign(tableData.value[index], roleForm)
          }
          ElMessage.success('更新成功')
        } else {
          // 新增角色
          const newRole = {
            ...roleForm,
            id: Date.now(),
            status: 1,
            createTime: new Date().toLocaleString()
          }
          tableData.value.push(newRole)
          ElMessage.success('创建成功')
        }
        dialogVisible.value = false
      } catch (error) {
        ElMessage.error('操作失败')
      }
    }
  })
}

// 保存权限
const handleSavePermission = () => {
  const checkedKeys = permissionTreeRef.value.getCheckedKeys()
  const halfCheckedKeys = permissionTreeRef.value.getHalfCheckedKeys()
  const allCheckedKeys = [...checkedKeys, ...halfCheckedKeys]
  
  console.log('角色权限:', {
    roleId: currentRole.value.id,
    permissions: allCheckedKeys
  })
  
  ElMessage.success('权限配置成功')
  permissionDialogVisible.value = false
}

// 关闭对话框
const handleDialogClose = () => {
  resetRoleForm()
}

// 重置角色表单
const resetRoleForm = () => {
  Object.assign(roleForm, {
    id: '',
    name: '',
    code: '',
    description: ''
  })
  roleFormRef.value?.resetFields()
}

onMounted(() => {
  // 初始化数据
})
</script>

<style scoped>
.role-management {
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

.permission-tree {
  max-height: 400px;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
}
</style>