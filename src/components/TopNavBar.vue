<script setup lang="ts">
defineProps<{
  username: string
}>()
</script>

<template>
  <nav class="navbar">
    <div class="nav-left">
      <router-link to="/docs" class="nav-link">Docs</router-link>
      <router-link to="/updates" class="nav-link">Updates</router-link>
      <router-link to="/records" class="nav-link">Meeting Records</router-link>
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
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
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
</style>
