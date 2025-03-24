<script setup lang="ts">
defineProps<{
  username: string
}>()
</script>

<template>
  <nav class="navbar">
    <div class="nav-left">
      <router-link to="/" class="nav-link">下载</router-link>
      <router-link to="/docs" class="nav-link">文档</router-link>
      <router-link to="/ability" class="nav-link">功能</router-link>
    </div>
    <div class="nav-right">
      <div class="user-profile">
        <span class="username">{{ username }}</span>
        <div class="avatar">
          {{ username.charAt(0).toUpperCase() }}
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  position: fixed;
  top:0;
  left: 0;
  right: 0;
  z-index: 3;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1rem;
  background: transparent;
  height: 80px;
}

.nav-left {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-size: 1rem;
  padding: 10px 20px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
  transition: opacity 0.3s;
}

.nav-link:hover {
  background-color: rgb(70, 70, 70);
  opacity: 0.8;
}

.nav-link.router-link-active {
  background-color: rgb(100, 100, 100);
  font-weight: 500;
  opacity: 1;
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
</style>
