<template>
  <div class="about-section">
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
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const isVisible = ref(false);

const handleScroll = () => {
  // 当滚动到页面底部附近时显示
  const bottom = window.innerHeight + window.pageYOffset >= document.documentElement.scrollHeight - 100;
  isVisible.value = bottom;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.about-section {
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
</style>
