<script setup lang="ts">
import DownloadBtn from './DownloadButton.vue'
</script>

<template>
  <div class="content">
    <transition name="fade-down" appear>
      <img alt="Smart Meeting Assistant logo" class="logo" src="../assets/ic_launcher.png" width="125" height="125" />
    </transition>
    <transition name="fade-right" appear>
      <h1>智能会议助手</h1>
    </transition>
    <transition name="fade-left" appear>
      <p class="description">提升您的会议效率，智能管理会议全流程</p>
    </transition>
    <transition name="fade-up" appear>
      <DownloadBtn Main="下载" Sub="android v1.0.0" />
    </transition>
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
  gap: 20px;
  text-align: center;
}

.logo {
  display: flex;
  margin-bottom: 20px;
}

h1 {
  font-size: 2.5em;
  margin: 0;
}

.description {
  font-size: 1.2em;
  color: white-soft;
  margin: 0;
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
</style>
