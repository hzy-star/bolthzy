<template>
  <div class="login-container">
    <div class="login-form">
      <div class="login-title">
        <h2>Vue Admin 系统</h2>
        <p>欢迎登录管理系统</p>
      </div>
      
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        auto-complete="on"
        label-position="left"
      >
        <el-form-item prop="username">
          <el-input
            ref="username"
            v-model="loginForm.username"
            placeholder="用户名"
            name="username"
            type="text"
            tabindex="1"
            auto-complete="on"
            size="large"
            prefix-icon="User"
          />
        </el-form-item>
        
        <el-form-item prop="password">
          <el-input
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="密码"
            name="password"
            tabindex="2"
            auto-complete="on"
            size="large"
            prefix-icon="Lock"
            @keyup.enter="handleLogin"
          >
            <template #suffix>
              <el-icon @click="showPwd" class="password-icon">
                <component :is="passwordType === 'password' ? 'View' : 'Hide'" />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        
        <el-button
          :loading="loading"
          type="primary"
          size="large"
          style="width: 100%; margin-bottom: 30px;"
          @click.prevent="handleLogin"
        >
          登录
        </el-button>
        
        <div class="login-tips">
          <p>测试账号：</p>
          <p>管理员：admin / 123456</p>
          <p>普通用户：user / 123456</p>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const loginFormRef = ref()
const username = ref()
const password = ref()

const loginForm = reactive({
  username: 'admin',
  password: '123456'
})

const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ]
}

const loading = ref(false)
const passwordType = ref('password')
const redirect = ref(undefined)

const showPwd = () => {
  if (passwordType.value === 'password') {
    passwordType.value = ''
  } else {
    passwordType.value = 'password'
  }
  nextTick(() => {
    password.value.focus()
  })
}

const handleLogin = () => {
  loginFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        await userStore.login(loginForm)
        ElMessage.success('登录成功')
        router.push({ path: redirect.value || '/', replace: true })
      } catch (error) {
        ElMessage.error(error.message || '登录失败')
      } finally {
        loading.value = false
      }
    }
  })
}

// 获取重定向地址
const getOtherQuery = (query) => {
  return Object.keys(query).reduce((acc, cur) => {
    if (cur !== 'redirect') {
      acc[cur] = query[cur]
    }
    return acc
  }, {})
}

redirect.value = route.query && route.query.redirect
</script>

<style scoped>
.login-title {
  text-align: center;
  margin-bottom: 40px;
}

.login-title h2 {
  margin: 0 0 10px 0;
  font-size: 28px;
  color: #333;
}

.login-title p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.password-icon {
  cursor: pointer;
  user-select: none;
}

.login-tips {
  text-align: center;
  color: #666;
  font-size: 12px;
  line-height: 1.5;
}

.login-tips p {
  margin: 4px 0;
}
</style>