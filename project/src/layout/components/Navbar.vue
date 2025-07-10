<template>
  <div class="navbar">
    <div class="navbar-left">
      <el-button
        type="text"
        @click="toggleSidebar"
        class="sidebar-toggle"
      >
        <el-icon><Fold v-if="sidebar.opened" /><Expand v-else /></el-icon>
      </el-button>
      
      <h2 class="navbar-title">Vue Admin</h2>
    </div>
    
    <div class="navbar-right">
      <el-dropdown @command="handleCommand">
        <span class="user-dropdown">
          <el-avatar 
            :src="userStore.avatar" 
            :size="32"
            class="user-avatar"
          />
          <span class="user-name">{{ userStore.name }}</span>
          <el-icon><ArrowDown /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">
              <el-icon><User /></el-icon>
              个人中心
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">
              <el-icon><SwitchButton /></el-icon>
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()

const sidebar = computed(() => appStore.sidebar)

const toggleSidebar = () => {
  appStore.toggleSidebar()
}

const handleCommand = async (command) => {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'logout':
      try {
        await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await userStore.logout()
        router.push('/login')
      } catch (error) {
        // 用户取消
      }
      break
  }
}
</script>

<style scoped>
.navbar {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
}

.navbar-left {
  display: flex;
  align-items: center;
}

.sidebar-toggle {
  margin-right: 15px;
  font-size: 18px;
}

.navbar-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1890ff;
}

.navbar-right {
  display: flex;
  align-items: center;
}

.user-dropdown {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.user-dropdown:hover {
  background-color: #f5f5f5;
}

.user-avatar {
  margin-right: 8px;
}

.user-name {
  margin-right: 8px;
  font-size: 14px;
}
</style>