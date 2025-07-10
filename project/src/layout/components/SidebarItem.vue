<template>
  <div v-if="!item.meta || !item.meta.hidden">
    <!-- 有子菜单 -->
    <el-sub-menu
      v-if="hasChildren"
      :index="resolvePath"
    >
      <template #title>
        <el-icon v-if="item.meta && item.meta.icon">
          <component :is="item.meta.icon" />
        </el-icon>
        <span>{{ item.meta && item.meta.title }}</span>
      </template>
      
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :item="child"
        :base-path="resolvePath"
      />
    </el-sub-menu>
    
    <!-- 无子菜单 -->
    <el-menu-item
      v-else
      :index="resolvePath"
    >
      <el-icon v-if="item.meta && item.meta.icon">
        <component :is="item.meta.icon" />
      </el-icon>
      <template #title>
        <span>{{ item.meta && item.meta.title }}</span>
      </template>
    </el-menu-item>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  basePath: {
    type: String,
    default: ''
  }
})

const hasChildren = computed(() => {
  return props.item.children && 
         props.item.children.length > 0 && 
         props.item.children.some(child => !child.meta || !child.meta.hidden)
})

const resolvePath = computed(() => {
  if (props.item.path.startsWith('/')) {
    return props.item.path
  }
  return `${props.basePath}/${props.item.path}`.replace(/\/+/g, '/')
})
</script>