<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import Toast from './Toast.vue'

const authStore = useAuthStore()
const showLoginModal = ref(false)
const isRegistering = ref(false)
const toastMessage = ref('')
const showToast = ref(false)
const showUserMenu = ref(false)

const showToastMessage = (message: string) => {
  toastMessage.value = message
  showToast.value = true
}

const handleLogin = async () => {
  if (await authStore.login()) {
    showLoginModal.value = false
    showToastMessage(`欢迎回来，${authStore.user?.username}`)
  } else {
    showToastMessage(`登录失败，请检查邮箱地址或密码`)
  }
}

const handleLogout = () => {
  authStore.logout()
  showToastMessage('已退出登录')
  showUserMenu.value = false
}

const handleVerify = async () => {
  if (await authStore.verify()) {
    showToastMessage('验证码已发送')
  } else {
    showToastMessage(`验证码发送失败，请稍后重试`)
  }
}

const handleRegister = async () => {
  if (await authStore.register()) {
    showLoginModal.value = false
    showToastMessage(`欢迎您，${authStore.user?.username}`)
  } else {
    showToastMessage(`注册失败，请检查验证码并稍后重试`)
  }
}

const switchMode = () => {
  isRegistering.value = !isRegistering.value
  // Reset form data when switching modes
  authStore.tempUserEmail = ''
  authStore.tempUserPasswd = ''
  authStore.tempUserName = ''
  authStore.tempUserVerifyCode = ''
}

// 点击其他地方关闭用户菜单
const handleClickOutside = (event: MouseEvent) => {
  const userMenu = document.querySelector('.user-menu')
  const avatar = document.querySelector('.avatar')
  if (
    userMenu &&
    !userMenu.contains(event.target as Node) &&
    avatar &&
    !avatar.contains(event.target as Node)
  ) {
    showUserMenu.value = false
  }
}

// 添加和移除点击事件监听器
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
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
        <div class="avatar" @click="showUserMenu = !showUserMenu">
          {{ authStore.user?.username.charAt(0).toUpperCase() }}
        </div>

        <!-- 用户信息菜单 -->
        <div v-if="showUserMenu" class="user-menu">
          <div class="user-info">
            <div class="user-avatar">
              {{ authStore.user?.username.charAt(0).toUpperCase() }}
            </div>
            <div class="user-details">
              <div class="user-name">{{ authStore.user?.username }}</div>
              <div class="user-email">{{ authStore.user?.useremail }}</div>
            </div>
          </div>
          <div class="menu-divider"></div>
          <div class="menu-actions">
            <button class="menu-button" @click="showUserMenu = false">
              <span>编辑资料</span>
            </button>
            <button class="menu-button logout" @click="handleLogout">
              <span>退出登录</span>
            </button>
          </div>
        </div>

        <!-- 用户登陆按钮，未登陆时显示 -->
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
  <Toast v-if="showToast" :message="toastMessage" @hide="showToast = false" />
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
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
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.username {
  color: white;
  margin-right: 0.5rem;
}

.avatar {
  width: 36px;
  height: 36px;
  background: #4caf50;
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
  background: rgba(149, 128, 255, 1);
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
  background: rgba(149, 128, 255, 1);
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
  color: rgba(149, 128, 255, 1);
}

.user-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 10px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 16px;
  min-width: 240px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.user-avatar {
  width: 48px;
  height: 48px;
  background: #4caf50;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 20px;
  color: white;
}

.user-details {
  flex: 1;
}

.user-name {
  font-weight: bold;
  color: white;
  margin-bottom: 4px;
}

.user-email {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9em;
}

.menu-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 8px 0;
}

.menu-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.menu-button {
  background: transparent;
  border: none;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.2s;
}

.menu-button:hover {
  background: rgba(255, 255, 255, 0.1);
}

.menu-button.logout {
  color: #ff6b6b;
}

.menu-button.logout:hover {
  background: rgba(255, 107, 107, 0.1);
}
</style>
