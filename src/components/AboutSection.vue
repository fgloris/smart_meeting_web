<template>
  <transition name="fade-up">
    <div class="about-section" v-show="isVisible">
      <div class="about-content">
        <h2>关于我们</h2>
        <p>智能会议助手致力于提供高效的会议解决方案，让每一次会议都能事半功倍。</p>
        <div class="contact-info">
          <h3>联系我们</h3>
          <p>邮箱: contact@smartmeeting.com</p>
        </div>
        <div class="copyright">
          © 2025 Smart Meeting Assistant. All rights reserved.
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const isVisible = ref(false);

const handleScroll = () => {
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  // 当距离底部100px时显示
  isVisible.value = (windowHeight + scrollTop) >= (documentHeight - 100);
};

// 初始化时也要检查一次
onMounted(() => {
  handleScroll(); // 初始检查
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.about-section {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  z-index: 2;
  color: rgb(180, 180, 180);
  padding: 3rem 0;
  margin-top: 4rem;
}

.about-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  padding: 0 2rem;
}

.contact-info {
  margin: 2rem 0;
}

.copyright {
  font-size: 0.9rem;
  opacity: 0.8;
  margin-top: 2rem;
}

.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.5s ease;
}

.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.fade-up-enter-to,
.fade-up-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
