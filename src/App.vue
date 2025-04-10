<script setup lang="ts">
const username = 'fgloris'

import { useAuthStore } from '@/stores/auth'
import { useRoute } from 'vue-router'
import TopNavBar from '@/components/TopNavBar.vue'
import SideNavBar from '@/components/SideNavBar.vue'

const route = useRoute()
const authStore = useAuthStore()
</script>

<template>
  <div class="main-page">
    <TopNavBar v-if="route.path !== '/chat'" />
    <div class="content" :class="{ 'no-margin': route.path === '/chat' }">
      <div v-if="authStore.isAuthenticated || !route.path.startsWith('/ability')" class="content-wrapper">
        <RouterView v-slot="{ Component }">
          <div class="layout-container" :class="{ 'is-chat': route.path === '/chat' }">
            <SideNavBar v-if="route.path.startsWith('/ability') || route.path === '/chat'" />
            <div class="main-content" :class="{ 'with-sidebar': route.path.startsWith('/ability') || route.path === '/chat' }">
              <component :is="Component" />
            </div>
          </div>
        </RouterView>
      </div>
      <div v-else class="login-message">
        <div class="login-container">
          <div class="login-icon">🔒</div>
          <div class="login-text">请先登录</div>
          <div class="login-subtext">您需要登录才能访问此功能</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main-page {
  z-index: 0;
  margin: auto;
  position: relative;
  display: flex;
  flex-direction: column;
  color: var(--text-color, white);
  min-height: 100vh;
}

.content {
  display: flex;
  flex-direction: column;
  margin-top: 80px;
  width: 100%;
  max-width: 100%;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  z-index: 1;
  flex: 1;
}

.content-wrapper {
  width: 100%;
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: transparent;
}

.layout-container {
  display: flex;
  position: relative;
  min-height: calc(100vh - 120px);
  flex: 1;
  overflow: hidden;
}

.main-content {
  flex: 1;
  transition: all 0.3s ease;
  width: 100%;
  padding: 0;
}

.main-content.with-sidebar {
  margin-left: 220px;
}

.login-message {
  text-align: center;
  margin: 4rem auto;
  width: 100%;
  max-width: 500px;
}

.login-container {
  background-color: var(--card-background);
  border-radius: 12px;
  padding: 3rem 2rem;
  box-shadow: 0 8px 32px var(--shadow-color);
  border: 1px solid var(--border-color);
}

.login-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.login-text {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--primary-color, #4285f4);
}

.login-subtext {
  font-size: 1rem;
  color: var(--text-color-light);
}

.spacer {
  height: 3rem;
}

@media (max-width: 992px) {
  .main-content.with-sidebar {
    margin-left: 60px;
  }
}

@media (max-width: 768px) {
  .content {
    margin-top: 0;
  }
  
  .main-content.with-sidebar {
    margin-left: 60px;
  }
  
  .login-message {
    margin: 2rem auto;
  }
  
  .login-container {
    padding: 2rem 1rem;
  }
  
  .login-icon {
    font-size: 3rem;
  }
  
  .login-text {
    font-size: 1.5rem;
  }
}

/* 当路由是聊天界面时的特殊处理 */
.layout-container.is-chat {
  height: 100vh;
  overflow: hidden;
  margin-top: -80px; /* 抵消content的margin-top */
  padding-top: 80px; /* 为顶部导航条留出空间 */
}

/* 聊天页面不需要上边距，因为聊天界面已经固定定位 */
.layout-container.is-chat .main-content {
  padding-top: 0;
}

@media (max-width: 768px) {
  .layout-container.is-chat {
    margin-top: 0;
    padding-top: 0;
  }
}

.content.no-margin {
  margin-top: 0;
}
</style>
