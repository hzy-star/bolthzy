<template>
  <el-menu
    :default-active="activeMenu"
    :collapse="!sidebar.opened"
    :unique-opened="false"
    :collapse-transition="false"
    mode="vertical"
    background-color="#001529"
    text-color="#fff"
    active-text-color="#1890ff"
    @select="handleSelect"
  >
    <sidebar-item
      v-for="route in routes"
      :key="route.path"
      :item="route"
      :base-path="route.path"
    />
  </el-menu>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import SidebarItem from './SidebarItem.vue'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()

const sidebar = computed(() => appStore.sidebar)
const routes = computed(() => userStore.routes)
const activeMenu = computed(() => route.path)

const handleSelect = (path) => {
  router.push(path)
}
</script>