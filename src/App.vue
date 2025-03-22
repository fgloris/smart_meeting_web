<script setup lang="ts">
const currentDate = "2025-03-22 02:44:36";
const username = "fgloris";
const navItems = ['Docs', 'Updates', 'Meeting Records'];

import DownloadBtn from './components/DownloadButton.vue'
import TopNavBar from './components/TopNavBar.vue'
import AboutSection from './components/AboutSection.vue'
import HomeContent from './components/HomeContent.vue'
import { createRouter } from 'vue-router'
</script>

<template>
  <div class="download-page">
    <TopNavBar v-bind:username="username" v-bind:navItems="navItems" />
    <div class="gradient-overlay"></div>
    <RouterView />
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
  z-index: 1;
  position: absolute;
  top: 0px;
  left: 0;
  right: 0;
  height: 1000px;
  background: linear-gradient(to bottom, 
    rgb(80,80,80) 0%,
    rgb(80,80,80) 10%,
    rgb(50,50,50) 60%,
    rgb(0,0,0) 100%
  );
  pointer-events: none; /* 确保不会影响其他元素的交互 */
}
</style>