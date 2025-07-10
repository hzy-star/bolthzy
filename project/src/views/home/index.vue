<template>
  <div class="home-container">
    <div class="page-card">
      <div class="welcome-section">
        <div class="welcome-content">
          <h1>欢迎使用 Vue Admin 系统</h1>
          <p class="welcome-desc">
            这是一个基于 Vue 3 + Vite + Element Plus 构建的现代化管理系统
          </p>
          <div class="user-info">
            <el-avatar :src="userStore.avatar" :size="60" />
            <div class="user-details">
              <h3>{{ userStore.name }}</h3>
              <p>{{ userStore.introduction }}</p>
              <el-tag v-for="role in userStore.roles" :key="role" type="primary">
                {{ role === 'admin' ? '管理员' : '普通用户' }}
              </el-tag>
            </div>
          </div>
        </div>
        <div class="welcome-image">
          <img src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1" alt="Welcome" />
        </div>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon user-icon">
          <el-icon><User /></el-icon>
        </div>
        <div class="stat-content">
          <h3>用户总数</h3>
          <p class="stat-number">1,234</p>
          <span class="stat-trend positive">+12%</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon order-icon">
          <el-icon><ShoppingCart /></el-icon>
        </div>
        <div class="stat-content">
          <h3>订单总数</h3>
          <p class="stat-number">5,678</p>
          <span class="stat-trend positive">+8%</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon revenue-icon">
          <el-icon><Money /></el-icon>
        </div>
        <div class="stat-content">
          <h3>总收入</h3>
          <p class="stat-number">¥89,012</p>
          <span class="stat-trend negative">-3%</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon visit-icon">
          <el-icon><View /></el-icon>
        </div>
        <div class="stat-content">
          <h3>访问量</h3>
          <p class="stat-number">12,345</p>
          <span class="stat-trend positive">+15%</span>
        </div>
      </div>
    </div>

    <div class="feature-grid">
      <div class="feature-card">
        <div class="feature-header">
          <h3>系统功能</h3>
        </div>
        <div class="feature-list">
          <div class="feature-item">
            <el-icon><Check /></el-icon>
            <span>用户权限管理</span>
          </div>
          <div class="feature-item">
            <el-icon><Check /></el-icon>
            <span>动态路由配置</span>
          </div>
          <div class="feature-item">
            <el-icon><Check /></el-icon>
            <span>响应式布局设计</span>
          </div>
          <div class="feature-item">
            <el-icon><Check /></el-icon>
            <span>数据可视化图表</span>
          </div>
        </div>
      </div>

      <div class="feature-card">
        <div class="feature-header">
          <h3>技术栈</h3>
        </div>
        <div class="tech-stack">
          <el-tag class="tech-tag" type="primary">Vue 3</el-tag>
          <el-tag class="tech-tag" type="success">Vite</el-tag>
          <el-tag class="tech-tag" type="info">Element Plus</el-tag>
          <el-tag class="tech-tag" type="warning">Pinia</el-tag>
          <el-tag class="tech-tag" type="danger">Vue Router</el-tag>
          <el-tag class="tech-tag">Axios</el-tag>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
</script>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-section {
  display: flex;
  align-items: center;
  gap: 40px;
  margin-bottom: 30px;
}

.welcome-content {
  flex: 1;
}

.welcome-content h1 {
  font-size: 32px;
  color: #333;
  margin: 0 0 16px 0;
  font-weight: 600;
}

.welcome-desc {
  font-size: 16px;
  color: #666;
  margin-bottom: 30px;
  line-height: 1.6;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-details h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #333;
}

.user-details p {
  margin: 0 0 12px 0;
  color: #666;
  font-size: 14px;
}

.welcome-image {
  flex-shrink: 0;
}

.welcome-image img {
  width: 300px;
  height: 200px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 16px;
  transition: transform 0.3s, box-shadow 0.3s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #fff;
}

.user-icon { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.order-icon { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
.revenue-icon { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
.visit-icon { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }

.stat-content h3 {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.stat-number {
  margin: 0 0 4px 0;
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.stat-trend {
  font-size: 12px;
  font-weight: 500;
}

.stat-trend.positive { color: #52c41a; }
.stat-trend.negative { color: #ff4d4f; }

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.feature-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.feature-header {
  padding: 20px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.feature-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.feature-list {
  padding: 24px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  font-size: 14px;
  color: #333;
}

.feature-item:last-child {
  margin-bottom: 0;
}

.feature-item .el-icon {
  color: #52c41a;
  font-size: 16px;
}

.tech-stack {
  padding: 24px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tech-tag {
  margin: 0;
}

@media (max-width: 768px) {
  .welcome-section {
    flex-direction: column;
    text-align: center;
  }
  
  .welcome-image img {
    width: 100%;
    max-width: 300px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .user-info {
    justify-content: center;
  }
}
</style>