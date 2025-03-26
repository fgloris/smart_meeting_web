<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

const showLoginModal = ref(false);

const handleLogin = async () => {
  if (await authStore.login(authStore.tempUserEmail, authStore.tempUserPasswd)){
    showLoginModal.value = false;
  }
};

const handleLogout = () => {
  authStore.logout();
};

</script>

<template>
  <nav class="navbar">
    <div v-if="true">
      <router-link to="/" class="nav-link">下载</router-link>
      <router-link to="/docs" class="nav-link">文档</router-link>
      <router-link to="/ability/records" class="nav-link">功能</router-link>
    </div>
    <div class="nav-right">
      <div v-if="authStore.isAuthenticated" class="user-profile">
        <span class="username">{{ authStore.user?.useremail }}</span>
        <div class="avatar">
          {{ authStore.user?.username.charAt(0).toUpperCase() }}
        </div>
      </div>
      <button v-else class="login-btn" @click="showLoginModal = true">登录</button>
    </div>
  </nav>
  <div v-if="showLoginModal" class="modal-overlay">
    <div class="modal">
      <h2>登录</h2>
      <input v-model="authStore.tempUserEmail" placeholder="邮箱" />
      <input v-model="authStore.tempUserPasswd" type="password" placeholder="密码" />
      <div class="modal-buttons">
        <button @click="handleLogin">登录</button>
        <button @click="showLoginModal = false">取消</button>
      </div>
    </div>
  </div>
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
  background-color: rgb(50, 50, 50, 0.8);
  opacity: 0.8;
}

.nav-link.router-link-active {
  background-color: rgb(120, 120, 120, 0.8);
  font-weight: 1000;
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

.login-btn {
  padding: 0.5rem 1rem;
  background: rgba(149, 128, 255, 0.6);
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 300px;
}

.modal h2 {
  color: #333;
  margin-bottom: 1rem;
}

.modal input {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.modal-buttons {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.modal-buttons button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.modal-buttons button:first-child {
  background: rgba(149, 128, 255, 0.6);
  color: white;
}
</style>
