<template>
  <div class="profile-container">
    <div class="page-card">
      <div class="profile-header">
        <div class="avatar-section">
          <el-avatar :src="userStore.avatar" :size="120" />
          <el-button type="primary" size="small" class="upload-btn">
            更换头像
          </el-button>
        </div>
        <div class="info-section">
          <h2>{{ userStore.name }}</h2>
          <p class="introduction">{{ userStore.introduction }}</p>
          <div class="roles">
            <el-tag 
              v-for="role in userStore.roles" 
              :key="role" 
              type="primary"
              class="role-tag"
            >
              {{ role === 'admin' ? '管理员' : '普通用户' }}
            </el-tag>
          </div>
        </div>
      </div>

      <el-divider />

      <div class="profile-content">
        <el-tabs v-model="activeTab" type="border-card">
          <el-tab-pane label="基本信息" name="basic">
            <el-form
              ref="profileFormRef"
              :model="profileForm"
              :rules="profileRules"
              label-width="100px"
              class="profile-form"
            >
              <el-form-item label="用户名" prop="username">
                <el-input v-model="profileForm.username" disabled />
              </el-form-item>
              
              <el-form-item label="姓名" prop="name">
                <el-input v-model="profileForm.name" />
              </el-form-item>
              
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="profileForm.email" />
              </el-form-item>
              
              <el-form-item label="手机号" prop="phone">
                <el-input v-model="profileForm.phone" />
              </el-form-item>
              
              <el-form-item label="个人简介" prop="introduction">
                <el-input
                  v-model="profileForm.introduction"
                  type="textarea"
                  :rows="4"
                  placeholder="请输入个人简介"
                />
              </el-form-item>
              
              <el-form-item>
                <el-button type="primary" @click="updateProfile">
                  保存修改
                </el-button>
                <el-button @click="resetForm">重置</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          
          <el-tab-pane label="修改密码" name="password">
            <el-form
              ref="passwordFormRef"
              :model="passwordForm"
              :rules="passwordRules"
              label-width="100px"
              class="password-form"
            >
              <el-form-item label="原密码" prop="oldPassword">
                <el-input
                  v-model="passwordForm.oldPassword"
                  type="password"
                  show-password
                />
              </el-form-item>
              
              <el-form-item label="新密码" prop="newPassword">
                <el-input
                  v-model="passwordForm.newPassword"
                  type="password"
                  show-password
                />
              </el-form-item>
              
              <el-form-item label="确认密码" prop="confirmPassword">
                <el-input
                  v-model="passwordForm.confirmPassword"
                  type="password"
                  show-password
                />
              </el-form-item>
              
              <el-form-item>
                <el-button type="primary" @click="updatePassword">
                  修改密码
                </el-button>
                <el-button @click="resetPasswordForm">重置</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const activeTab = ref('basic')
const profileFormRef = ref()
const passwordFormRef = ref()

// 个人信息表单
const profileForm = reactive({
  username: 'admin',
  name: userStore.name,
  email: 'admin@example.com',
  phone: '13800138000',
  introduction: userStore.introduction
})

const profileRules = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ]
}

// 密码修改表单
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const validateConfirmPassword = (rule, value, callback) => {
  if (value !== passwordForm.newPassword) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const passwordRules = {
  oldPassword: [
    { required: true, message: '请输入原密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

// 更新个人信息
const updateProfile = () => {
  profileFormRef.value.validate((valid) => {
    if (valid) {
      // 这里应该调用API更新用户信息
      ElMessage.success('个人信息更新成功')
    }
  })
}

// 重置个人信息表单
const resetForm = () => {
  profileFormRef.value.resetFields()
}

// 修改密码
const updatePassword = () => {
  passwordFormRef.value.validate((valid) => {
    if (valid) {
      // 这里应该调用API修改密码
      ElMessage.success('密码修改成功')
      resetPasswordForm()
    }
  })
}

// 重置密码表单
const resetPasswordForm = () => {
  passwordFormRef.value.resetFields()
}
</script>

<style scoped>
.profile-container {
  max-width: 800px;
  margin: 0 auto;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 30px;
  margin-bottom: 20px;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.upload-btn {
  font-size: 12px;
}

.info-section h2 {
  margin: 0 0 10px 0;
  font-size: 24px;
  color: #333;
}

.introduction {
  margin: 0 0 15px 0;
  color: #666;
  font-size: 14px;
  line-height: 1.5;
}

.roles {
  display: flex;
  gap: 8px;
}

.role-tag {
  margin: 0;
}

.profile-content {
  margin-top: 20px;
}

.profile-form,
.password-form {
  max-width: 500px;
  margin: 20px 0;
}

@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
  }
  
  .profile-form,
  .password-form {
    max-width: 100%;
  }
}
</style>