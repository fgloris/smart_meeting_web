<script setup lang="ts">
import DownloadBtn from './DownloadButton.vue'
</script>

<template>
  <div class="content">
    <img alt="Smart Meeting Assistant logo" class="logo" src="../assets/ic_launcher.png" width="125" height="125" />
    <h1>智能会议助手</h1>
    <p class="description">提升您的会议效率，智能管理会议全流程</p>
    <DownloadBtn Main="下载" Sub="android v1.0.0" />
  </div>
</template>

<style scoped>
.content {
  z-index: 2;
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
