<script setup lang="ts">
import DownloadBtn from './DownloadButton.vue'
import { ref, onMounted } from 'vue'

const showDirectDownload = ref(false)
const animateBackground = ref(false)

const toggleDirectDownload = () => {
  showDirectDownload.value = !showDirectDownload.value
}

onMounted(() => {
  // 页面加载后延迟启动背景动画，提高性能
  setTimeout(() => {
    animateBackground.value = true
  }, 800)
})
</script>

<template>
  <div class="content">
    <!-- 背景动效元素 -->
    <div class="bg-elements" :class="{ 'animate': animateBackground }">
      <div class="bg-circle circle-1"></div>
      <div class="bg-circle circle-2"></div>
      <div class="bg-circle circle-3"></div>
      <div class="bg-blob blob-1"></div>
      <div class="bg-blob blob-2"></div>
    </div>
    
    <transition name="fade-down" appear>
      <img alt="Smart Meeting Assistant logo" class="logo" src="@/assets/ic_launcher.png" width="125" height="125" />
    </transition>
    <transition name="fade-right" appear>
      <h1 class="gradient-text">智能会议助手</h1>
    </transition>
    <transition name="fade-left" appear>
      <p class="description">提升您的会议效率，智能管理会议全流程</p>
    </transition>
    <transition name="fade-up" appear>
      <div class="download-container">
        <DownloadBtn Main="下载" Sub="android v1.0.0" />
        <div class="direct-download-toggle" @click="toggleDirectDownload">
          <span class="toggle-text">或直接下载</span>
          <span class="toggle-icon" :class="{ 'is-active': showDirectDownload }">▼</span>
        </div>
        <div v-if="showDirectDownload" class="direct-download-panel">
          <a href="/assets/smartmeeting.apk" download="智能会议助手.apk" class="direct-download-link">下载安卓版 (v1.0.0)</a>
          <div class="download-info">
            <span class="info-item">15.8 MB</span>
            <span class="info-item">Android 7.0+</span>
          </div>
        </div>
      </div>
    </transition>
    
    <!-- 功能介绍区域 -->
    <div class="features-preview">
      <div class="feature-highlight">
        <div class="feature-icon-wrapper">
          <span class="feature-icon">🎯</span>
        </div>
        <div class="feature-text">高效会议记录</div>
      </div>
      <div class="feature-highlight">
        <div class="feature-icon-wrapper">
          <span class="feature-icon">🔍</span>
        </div>
        <div class="feature-text">智能内容分析</div>
      </div>
      <div class="feature-highlight">
        <div class="feature-icon-wrapper">
          <span class="feature-icon">🤖</span>
        </div>
        <div class="feature-text">AI 辅助决策</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.content {
  z-index: 1;
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  text-align: center;
  padding: 4rem 2rem;
  overflow: hidden;
  min-height: 100vh;
}

/* 背景效果 */
.bg-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
}

.bg-circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 1s ease;
}

.bg-elements.animate .bg-circle {
  opacity: 0.05;
}

.circle-1 {
  top: -10%;
  right: -5%;
  width: 60vmin;
  height: 60vmin;
  background: radial-gradient(circle at center, var(--primary-color) 0%, transparent 70%);
  animation: orbit 40s infinite linear;
}

.circle-2 {
  bottom: -20%;
  left: -15%;
  width: 80vmin;
  height: 80vmin;
  background: radial-gradient(circle at center, var(--secondary-color) 0%, transparent 70%);
  animation: orbit 50s infinite linear reverse;
}

.circle-3 {
  top: 40%;
  left: 60%;
  width: 40vmin;
  height: 40vmin;
  background: radial-gradient(circle at center, var(--accent-color) 0%, transparent 70%);
  animation: orbit 30s infinite linear;
}

@keyframes orbit {
  0% {
    transform: rotate(0deg) translateX(10px) rotate(0deg);
  }
  100% {
    transform: rotate(360deg) translateX(10px) rotate(-360deg);
  }
}

.bg-blob {
  position: absolute;
  filter: blur(60px);
  opacity: 0;
  transition: opacity 1s ease;
}

.bg-elements.animate .bg-blob {
  opacity: 0.03;
}

.blob-1 {
  top: 20%;
  right: 15%;
  width: 50vmin;
  height: 30vmin;
  background: var(--primary-color);
  border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
  animation: morph 15s infinite alternate ease-in-out;
}

.blob-2 {
  bottom: 15%;
  left: 10%;
  width: 40vmin;
  height: 40vmin;
  background: var(--secondary-color);
  border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
  animation: morph 18s infinite alternate-reverse ease-in-out;
}

@keyframes morph {
  0% {
    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
  }
  50% {
    border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
  }
  100% {
    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
  }
}

.logo {
  display: flex;
  margin-bottom: 1.5rem;
  filter: drop-shadow(0 8px 24px rgba(66, 133, 244, 0.25));
}

h1.gradient-text {
  font-size: 3.5rem;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #4285f4, #34a853);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
  letter-spacing: -0.5px;
  filter: drop-shadow(0 2px 5px rgba(66, 133, 244, 0.1));
}

.description {
  font-size: 1.25rem;
  color: var(--text-color-light);
  margin-bottom: 2.5rem;
  max-width: 600px;
  line-height: 1.6;
}

.download-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 3rem;
  gap: 1rem;
}

.direct-download-toggle {
  margin-top: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-color-light);
  font-size: 0.9rem;
  transition: color 0.3s ease;
  padding: 0.5rem 1rem;
  border-radius: 20px;
}

.direct-download-toggle:hover {
  color: var(--text-color);
  background-color: rgba(0, 0, 0, 0.05);
}

.toggle-icon {
  font-size: 0.8rem;
  transition: transform 0.3s ease;
}

.toggle-icon.is-active {
  transform: rotate(180deg);
}

.direct-download-panel {
  margin-top: 1rem;
  background-color: var(--card-background);
  border-radius: 12px;
  padding: 1rem;
  animation: fadeIn 0.3s ease;
  border: 1px solid var(--border-color);
  box-shadow: 0 10px 25px var(--shadow-color);
  width: 260px;
}

.direct-download-link {
  display: block;
  color: var(--primary-color, #4285f4);
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  padding: 0.75rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  text-align: center;
}

.direct-download-link:hover {
  background-color: rgba(66, 133, 244, 0.08);
  transform: translateY(-2px);
}

.download-info {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: var(--text-color-light);
}

/* 功能亮点区域 */
.features-preview {
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-top: 2rem;
  flex-wrap: wrap;
  max-width: 900px;
}

.feature-highlight {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 200px;
  transition: transform 0.3s ease;
}

.feature-highlight:hover {
  transform: translateY(-5px);
}

.feature-icon-wrapper {
  width: 70px;
  height: 70px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 25px rgba(66, 133, 244, 0.15);
  margin-bottom: 0.5rem;
}

.feature-icon {
  font-size: 2rem;
}

.feature-text {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-color);
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

/* 向下淡入动画 - 用于logo */
.fade-down-enter-active {
  transition: all 0.8s ease;
}
.fade-down-enter-from {
  opacity: 0;
  transform: translateY(-30px);
}
.fade-down-enter-to {
  opacity: 1;
  transform: translateY(0);
}

/* 向右淡入动画 - 用于标题 */
.fade-right-enter-active {
  transition: all 0.8s ease 0.3s; /* 添加0.3s延迟 */
}
.fade-right-enter-from {
  opacity: 0;
  transform: translateX(-50px);
}
.fade-right-enter-to {
  opacity: 1;
  transform: translateX(0);
}

/* 向左淡入动画 - 用于描述文字 */
.fade-left-enter-active {
  transition: all 0.8s ease 0.3s; /* 添加0.6s延迟 */
}
.fade-left-enter-from {
  opacity: 0;
  transform: translateX(50px);
}
.fade-left-enter-to {
  opacity: 1;
  transform: translateX(0);
}

/* 向上淡入动画 - 用于下载按钮 */
.fade-up-enter-active {
  transition: all 0.8s ease-in 0.3s; /* 添加0.9s延迟 */
}
.fade-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}
.fade-up-enter-to {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 768px) {
  .content {
    padding: 3rem 1rem;
    gap: 1.5rem;
  }
  
  h1.gradient-text {
    font-size: 2.5rem;
  }
  
  .description {
    font-size: 1.1rem;
    margin-bottom: 2rem;
  }
  
  .features-preview {
    gap: 2rem;
  }
  
  .feature-highlight {
    width: 150px;
  }
  
  .feature-icon-wrapper {
    width: 60px;
    height: 60px;
  }
  
  .feature-icon {
    font-size: 1.75rem;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 1.8em;
  }
  
  .description {
    font-size: 1em;
  }
  
  .logo {
    width: 100px;
    height: 100px;
  }
  
  .features-preview {
    flex-direction: column;
    gap: 1rem;
  }
  
  .feature-highlight {
    flex-direction: row;
    width: 100%;
    justify-content: flex-start;
    padding: 0.5rem;
    border-radius: 10px;
    background: rgba(66, 133, 244, 0.05);
  }
  
  .feature-icon-wrapper {
    width: 40px;
    height: 40px;
    margin-bottom: 0;
    border-radius: 12px;
  }
  
  .feature-icon {
    font-size: 1.3rem;
  }
}
</style>
