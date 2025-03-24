<script setup lang="ts">
</script>

<template>
  <nav class="navbar">
    <div class="nav-left">
      <router-link to="/ability/records" class="nav-link first":key="1">会议记录</router-link>
      <router-link to="/ability/stream" class="nav-link second":key="2">直播开会</router-link>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  z-index: 3;
  position: fixed;
  top: 80px;
  bottom: 0%;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  padding: 1rem 1rem;
  background: transparent;
  background: linear-gradient(to bottom, 
    rgba(200, 200, 200, 0.25) 0%,
    rgba(200, 200, 200, 0.25) 10%,
    rgba(200, 200, 200, 0.15) 60%,
    rgba(200, 200, 200, 0.0) 100%
  );
  border-top-right-radius: 20px;

}

.nav-left {
  flex-direction: column;
  display: flex;
  gap: 2rem;
}

.nav-link {
  position: relative;
  color: white;
  text-decoration: none;
  font-size: 1rem;
  border-radius: 20px;
  padding: 10px 20px;
  transition: opacity 0.3s;
  animation: slide-down 0.5s ease-out;
}

.nav-link:hover {
  background-color: rgba(70, 70, 70, 0.8);
  opacity: 0.8;
}

.nav-link.router-link-active {
  background-color: rgba(90, 90, 90, 0.8);
  font-weight: 1000;
  opacity: 1;
}

@keyframes slide-down {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0px);
  }
}
</style>
