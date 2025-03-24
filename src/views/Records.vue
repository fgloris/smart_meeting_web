<template>
  <div class="records-page">
    <div class="docs-container">
      <transition-group 
        name="slide-fade" 
        tag="div"
        appear
      >
        <div class="docs-content" :key="1">
          <h2>快速开始</h2>
          <p>了解如何使用智能会议助手提升您的会议效率。</p>
        </div>
        <div class="docs-content" :key="2">
          <h2>基础功能</h2>
          <p>探索智能会议助手的核心功能。</p>
        </div>
        <!-- 可以添加更多文档内容 -->
      </transition-group>
    </div>
  </div>
</template>

<style scoped>
.records-page {
  z-index: 1;
  padding: 2rem;
  color: white;
}

.docs-container {
  max-width: 800px;
  margin: 0 auto;
}

.docs-content {
  padding: 2rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  margin-bottom: 1rem;
  transition: all 0.8s ease;
}

/* 添加动画相关样式 */
.slide-fade-enter-active {
  transition: all 0.8s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(-50px);
}

.slide-fade-enter-to {
  opacity: 1;
  transform: translateX(0);
}

/* 为每个文档块添加延迟动画 */
.docs-content:nth-child(1) { transition-delay: 0.1s; }
.docs-content:nth-child(2) { transition-delay: 0.2s; }
.docs-content:nth-child(3) { transition-delay: 0.3s; }
</style>
