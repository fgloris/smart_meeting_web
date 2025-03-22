<script setup lang="ts">
const currentDate = "2025-03-22 02:44:36";
const username = "fgloris";
const navItems = ['Docs', 'Updates', 'Meeting Records'];

import DownloadBtn from './components/DownloadButton.vue'
import TopNavBar from './components/TopNavBar.vue'
</script>

<template>
  <div class="download-page">
    <TopNavBar v-bind:username="username" v-bind:navItems="navItems" />
    <div class="gradient-overlay"></div>
    <div class="content">
      <img alt="Smart Meeting Assistant logo" class="logo" src="./assets/ic_launcher.png" width="125" height="125" />
      <h1>智能会议助手</h1>
      <p class="description">提升您的会议效率，智能管理会议全流程</p>
      <DownloadBtn Main="下载" Sub="v1.0.0" />
    </div>
  </div>
</template>

<style scoped>
.download-page {
  margin: auto;
  background: black;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column; /* 改为纵向排列 */
  color: white;
}

.gradient-overlay {
  position: absolute;
  top: 80px;
  left: 0;
  right: 0;
  height: 1000px;
  background: linear-gradient(to bottom, 
    rgba(255, 255, 255, 0.30) 0%,
    rgba(255, 255, 255, 0.2) 30%,
    rgba(255, 255, 255, 0.1) 60%,
    rgba(255, 255, 255, 0) 100%
  );
  pointer-events: none; /* 确保不会影响其他元素的交互 */
}

.content {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  text-align: center;
}

.logo {
  display: block;
  margin-bottom: 20px;
}

h1 {
  font-size: 2.5em;
  margin: 0;
}

.description {
  font-size: 1.2em;
  color: white-soft;
  margin: 0;
}


</style>