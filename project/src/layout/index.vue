<template>
  <div class="layout">
    <Sidebar />
    <div class="main-container">
      <Navbar />
      <div class="content-wrapper">
        <Breadcrumb />
        <div class="app-main">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from './components/Sidebar.vue'
import Navbar from './components/Navbar.vue'
import Breadcrumb from './components/Breadcrumb.vue'

export default {
  name: 'Layout',
  components: {
    Sidebar,
    Navbar,
    Breadcrumb
  }
}
</script>

<style scoped>
.layout {
  display: flex;
  height: 100vh;
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.app-main {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #f5f5f5;
}
</style>