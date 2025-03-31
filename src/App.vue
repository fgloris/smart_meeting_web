<script setup lang="ts">
const username = 'fgloris'

import { useAuthStore } from '@/stores/auth'
import { useRoute } from 'vue-router'
import TopNavBar from '@/components/TopNavBar.vue'
import SideNavBar from '@/components/SideNavBar.vue'
import AboutSection from '@/components/AboutSection.vue'

const route = useRoute()
const authStore = useAuthStore()
</script>

<template>
  <div class="main-page">
    <TopNavBar />
    <div class="content">
      <div v-if="authStore.isAuthenticated || !route.path.startsWith('/ability')">
        <RouterView v-slot="{ Component }">
          <SideNavBar v-show="route.path.startsWith('/ability')" />
          <component :is="Component" />
        </RouterView>
      </div>
      <div v-else class="login-message">请先登录</div>
      <AboutSection />
    </div>
  </div>
</template>

<style scoped>
.main-page {
  z-index: 0;
  margin: auto;
  background: black;
  position: relative;
  display: flex;
  flex-direction: column; /* 改为纵向排列 */
  color: white;
  background: linear-gradient(
    to bottom,
    rgb(255, 255, 255, 0.25) 0%,
    rgb(255, 255, 255, 0.25) 10%,
    rgb(255, 255, 255, 0.15) 60%,
    rgb(255, 255, 255, 0) 100%
  );
  min-height: 120vh;
}
.content {
  display: flex;
  flex-direction: column;
  margin-top: 4%;
}
.login-message {
  text-align: center;
  margin-top: 4%;
  font-size: 2rem;
}
</style>
