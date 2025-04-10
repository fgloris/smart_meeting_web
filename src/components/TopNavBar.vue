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
    <div class="nav-left">
      <router-link to="/" class="logo-link">
        <img src="@/assets/ic_launcher.png" alt="智能会议助手" class="navbar-logo">
        <span class="logo-text">智能会议助手</span>
      </router-link>
      <div class="nav-links">
        <router-link to="/" class="nav-link">主页</router-link>
        <router-link to="/download" class="nav-link">下载</router-link>
        <router-link to="/ability/records" class="nav-link">功能</router-link>
      </div>
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  height: 80px;
  width: 100%;
  background: linear-gradient(to right, #1a202c, #2d3748);
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.nav-left {
  display: flex;
  align-items: center;
}

.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  margin-right: 2rem;
}

.navbar-logo {
  width: 36px;
  height: 36px;
  margin-right: 0.5rem;
}

.logo-text {
  font-weight: 600;
  font-size: 1.2rem;
  color: white;
  background: linear-gradient(90deg, var(--primary-color, #4285f4), var(--secondary-color, #34a853));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.nav-links {
  display: flex;
  gap: 0.5rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-size: 0.95rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-link.router-link-active {
  background-color: rgba(66, 133, 244, 0.2);
  color: var(--primary-color, #4285f4);
  font-weight: 500;
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
  font-size: 0.9rem;
  opacity: 0.9;
}

.avatar {
  width: 36px;
  height: 36px;
  background: var(--primary-color, #4285f4);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(66, 133, 244, 0.3);
  transition: transform 0.2s ease;
}

.avatar:hover {
  transform: scale(1.05);
}

.login-btn {
  padding: 0.5rem 1.2rem;
  background: var(--primary-color, #4285f4);
  border: none;
  border-radius: 20px;
  color: white;
  cursor: pointer;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(66, 133, 244, 0.3);
  transition: all 0.3s ease;
}

.login-btn:hover {
  background: var(--secondary-color, #34a853);
  transform: translateY(-2px);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.modal {
  background: #1e1e1e;
  border-radius: 10px;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
}

.modal h2 {
  color: white;
  margin-top: 0;
  margin-bottom: 1.5rem;
  text-align: center;
}

.modal input {
  width: 100%;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  border-radius: 5px;
  color: white;
  font-size: 1rem;
}

.modal input:focus {
  outline: none;
  border-color: var(--primary-color, #4285f4);
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
  padding: 0 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  white-space: nowrap;
}

.modal-buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.modal-buttons button {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
}

.modal-buttons button:first-child {
  background: var(--primary-color, #4285f4);
  color: white;
}

.modal-buttons button:last-child {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.modal-buttons-switchmode {
  width: 100%;
  padding: 0.5rem;
  background: transparent;
  border: none;
  color: var(--primary-color, #4285f4);
  cursor: pointer;
  text-align: center;
}

.user-menu {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  background: #1e1e1e;
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
  width: 250px;
  z-index: 4;
  overflow: hidden;
  animation: fadeIn 0.2s ease;
}

.user-info {
  display: flex;
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(66, 133, 244, 0.1), rgba(52, 168, 83, 0.1));
}

.user-avatar {
  width: 48px;
  height: 48px;
  background: var(--primary-color, #4285f4);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
  margin-right: 1rem;
}

.user-details {
  flex: 1;
}

.user-name {
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: white;
}

.user-email {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
}

.menu-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 0 1rem;
}

.menu-actions {
  padding: 1rem;
}

.menu-button {
  width: 100%;
  padding: 0.75rem;
  background: transparent;
  border: none;
  border-radius: 5px;
  color: white;
  text-align: left;
  cursor: pointer;
  margin-bottom: 0.5rem;
  transition: background-color 0.2s ease;
}

.menu-button:hover {
  background: rgba(255, 255, 255, 0.1);
}

.menu-button.logout {
  color: #f44336;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .navbar {
    padding: 0.5rem 1rem;
  }
  
  .logo-text {
    display: none;
  }
  
  .logo-link {
    margin-right: 1rem;
  }
  
  .nav-link {
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
  }
  
  .username {
    display: none;
  }
}

@media (max-width: 480px) {
  .nav-links {
    gap: 0.2rem;
  }
  
  .nav-link {
    padding: 0.5rem 0.6rem;
    font-size: 0.8rem;
  }
  
  .login-btn {
    padding: 0.5rem 0.8rem;
    font-size: 0.9rem;
  }
}
</style>
