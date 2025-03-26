<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const showLoginModal = ref(false);
const isRegistering = ref(false);

const handleLogin = async () => {
  if (await authStore.login()) {
    showLoginModal.value = false;
  }
};

const handleLogout = () => {
  authStore.logout();
};

const handleVerify = async () => {
  await authStore.verify();
};

const handleRegister = async () => {
  await authStore.register();
};

const switchMode = () => {
  isRegistering.value = !isRegistering.value;
  // Reset form data when switching modes
  authStore.tempUserEmail = '';
  authStore.tempUserPasswd = '';
  authStore.tempUserName = '';
  authStore.tempUserVerifyCode = '';
};
</script>

<template>
  <nav class="navbar">
    <div v-if="true" class="nav-left">
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
      <h2>{{ isRegistering ? '注册' : '登录' }}</h2>
      
      <!-- Login Form -->
      <template v-if="!isRegistering">
        <input v-model="authStore.tempUserEmail" placeholder="邮箱" />
        <input v-model="authStore.tempUserPasswd" type="password" placeholder="密码" />
        <div class="modal-buttons">
          <button @click="handleLogin">登录</button>
          <button @click="showLoginModal = false">取消</button>
        </div>
        <button class="modal-buttons-switchmode" @click="switchMode">没有账号？去注册一个</button>
      </template>

      <!-- Register Form -->
      <template v-else>
        <input v-model="authStore.tempUserEmail" placeholder="邮箱" />
        <input v-model="authStore.tempUserName" placeholder="用户名" />
        <input v-model="authStore.tempUserPasswd" type="password" placeholder="密码" />
        <div class="verify-group">
          <input v-model="authStore.tempUserVerifyCode" placeholder="验证码" />
          <button class="verify-btn" @click="handleVerify">获取验证码</button>
        </div>
        <div class="modal-buttons">
          <button @click="handleRegister">注册</button>
          <button @click="showLoginModal = false">取消</button>
        </div>
        <button class="modal-buttons-switchmode" @click="switchMode">已有账号？返回登陆</button>
      </template>
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
  gap: 1rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-size: 1rem;
  padding: 5px 20px;
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
  background: rgba(149, 128, 255, 0.8);
  border: none;
  border-radius: 20px;
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
  z-index: 10;
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
  background: rgba(149, 128, 255, 0.8);
  color: white;
}

.verify-group {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.verify-group input {
  flex: 1;
  margin-bottom: 0;
}

.verify-btn {
  padding: 0.5rem 1rem;
  background: rgba(149, 128, 255, 0.8);
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  white-space: nowrap;
}

.verify-btn:hover {
  background: rgba(149, 128, 255, 1.0);
}

.modal {
  max-width: 400px;
  width: 90%;
}

.modal-buttons button {
  flex: 1;
  background: rgba(149, 128, 255, 0.8);
  margin-top: 5%;
  color: white;
}

.modal-buttons button:hover {
  background: rgba(149, 128, 255, 1.0);
}

.modal-buttons-switchmode {
  width: 100%;
  padding: 0.5rem;
  border: none;
  background: transparent;
  color: rgba(149, 128, 255, 0.8);
  text-decoration: underline;
  cursor: pointer;
  font-size: 0.9rem;
  margin-top: 1rem;
}

.modal-buttons-switchmode:hover {
  color: rgba(149, 128, 255, 1.0);
}
</style>
