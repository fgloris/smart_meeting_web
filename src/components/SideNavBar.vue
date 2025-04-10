<script setup lang="ts"></script>

<template>
  <nav class="navbar">
    <div class="nav-left">
      <router-link to="/ability/records" class="nav-link" :key="1">
        <span class="nav-icon">📝</span>
        <span class="nav-text">会议记录</span>
      </router-link>
      <router-link to="/ability/stream" class="nav-link" :key="2">
        <span class="nav-icon">📡</span>
        <span class="nav-text">直播开会</span>
      </router-link>
      <router-link to="/ability/chat" class="nav-link" :key="3">
        <span class="nav-icon">💬</span>
        <span class="nav-text">聊天</span>
      </router-link>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 80px;
  left: 0;
  bottom: 0;
  width: 220px;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.95), rgba(245, 245, 250, 0.9));
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border-right: 1px solid rgba(0, 0, 0, 0.05);
  z-index: 50;
  transition: all 0.3s ease;
}

.nav-left {
  flex-direction: column;
  display: flex;
  gap: 1.5rem;
  width: 100%;
}

.nav-link {
  position: relative;
  color: #5f6368;
  text-decoration: none;
  font-size: 1rem;
  border-radius: 12px;
  padding: 12px 16px;
  transition: all 0.3s ease;
  animation: slide-down 0.5s ease-out;
  text-align: left;
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.6);
  border-left: 3px solid transparent;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
  font-weight: 500;
}

.nav-icon {
  font-size: 1.3rem;
  margin-right: 10px;
  opacity: 0.8;
  transition: all 0.3s ease;
}

.nav-text {
  transition: all 0.3s ease;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.9);
  color: #1a73e8;
  transform: translateX(5px);
  box-shadow: 0 4px 12px rgba(66, 133, 244, 0.1);
}

.nav-link:hover .nav-icon {
  opacity: 1;
}

.nav-link.router-link-active {
  background-color: rgba(255, 255, 255, 0.95);
  font-weight: 600;
  color: #1a73e8;
  border-left: 3px solid #1a73e8;
  box-shadow: 0 5px 15px rgba(66, 133, 244, 0.12);
}

.nav-link.router-link-active::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: 5px;
  background: linear-gradient(to bottom, #1a73e8, #8ab4f8);
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  opacity: 0.8;
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

@media (max-width: 992px) {
  .navbar {
    width: 60px;
    padding: 1rem 0.5rem;
  }
  
  .nav-text {
    display: none;
  }
  
  .nav-link {
    padding: 12px;
    justify-content: center;
  }
  
  .nav-icon {
    margin-right: 0;
    font-size: 1.5rem;
  }
}
</style>
