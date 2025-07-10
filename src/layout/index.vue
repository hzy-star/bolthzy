<template>
  <div class="layout-container">
    <div class="layout-header">
      <Navbar />
    </div>
    <div class="layout-content">
      <div 
        class="layout-sidebar" 
        :class="{ 
          collapsed: !sidebar.opened,
          'mobile-open': sidebar.mobileOpen 
        }"
      >
        <Sidebar />
      </div>
      <div class="layout-main">
        <div class="breadcrumb-container">
          <Breadcrumb />
        </div>
        <router-view />
      </div>
    </div>
    <!-- 移动端遮罩 -->
    <div 
      v-if="device === 'mobile' && sidebar.mobileOpen"
      class="sidebar-overlay show"
      @click="closeSidebar"
    ></div>
  </div>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount } from 'vue'
import { useAppStore } from '@/stores/app'
import Navbar from './components/Navbar.vue'
import Sidebar from './components/Sidebar.vue'
import Breadcrumb from './components/Breadcrumb.vue'

const appStore = useAppStore()

const sidebar = computed(() => appStore.sidebar)
const device = computed(() => appStore.device)

const closeSidebar = () => {
  appStore.closeSidebar(false)
}

const handleResize = () => {
  appStore.initDevice()
}

onMounted(() => {
  appStore.initDevice()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
/* 样式已在全局样式中定义 */
</style>