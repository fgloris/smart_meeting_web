<script setup lang="ts">
</script>

<template>
  <nav class="navbar">
    <div class="nav-left">
      <router-link to="/ability/records" class="nav-link">会议记录</router-link>
      <router-link to="/ability/stream" class="nav-link">直播开会</router-link>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  z-index: 3;
  position: fixed;
  margin-top: 3%;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1rem;
  background: transparent;
  height: 80px;
}

.nav-left {
  margin-top: 100;
  flex-direction: column;
  display: flex;
  gap: 2rem;
  animation: slide-down 0.5s ease-out;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-size: 1rem;
  padding: 10px 20px;
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

@keyframes slide-down {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
