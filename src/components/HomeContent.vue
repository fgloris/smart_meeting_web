<script setup lang="ts">
import DownloadBtn from './DownloadButton.vue'
</script>

<template>
  <div class="content">
    <img alt="Smart Meeting Assistant logo" class="logo" src="../assets/ic_launcher.png" width="125" height="125" />
    <h1>智能会议助手</h1>
    <p class="description">提升您的会议效率，智能管理会议全流程</p>
    <DownloadBtn Main="下载" Sub="v1.0.0" />
  </div>
</template>

<style scoped>
.content {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  text-align: center;
  min-height: calc(100vh - 80px);
  padding: 2rem;
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
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
}
</style>
