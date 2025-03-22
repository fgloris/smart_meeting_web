<script setup lang="ts">
const currentDate = "2025-03-22 02:44:36";
const username = "fgloris";
import DownloadBtn from './components/DownloadButton.vue'
</script>

<template>
  <div class="download-page">
    <nav class="navbar">
      <div class="nav-left">
        <a href="#" class="nav-link">Docs</a>
        <a href="#" class="nav-link">Updates</a>
        <a href="#" class="nav-link">Meeting Records</a>
      </div>
      <div class="nav-right">
        <div class="user-profile">
          <span class="username">{{ username }}</span>
          <div class="avatar">
            <!-- 这里可以替换成实际的头像图片 -->
            {{ username.charAt(0).toUpperCase() }}
          </div>
        </div>
      </div>
    </nav>

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

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
}

.nav-left {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-size: 1rem;
  transition: opacity 0.3s;
}

.nav-link:hover {
  opacity: 0.8;
}

.nav-right {
  display: flex;
  align-items: center;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.username {
  color: white;
}

.avatar {
  width: 36px;
  height: 36px;
  background: #4CAF50;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  cursor: pointer;
}

.content {
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