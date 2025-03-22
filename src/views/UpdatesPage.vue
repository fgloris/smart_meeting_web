<template>
  <div class="updates-page">
    <h1>更新日志</h1>
    <div class="updates-content">
      <div class="update-item">
        <h3>v1.0.0 (2025-03-22)</h3>
        <ul>
          <li>首次发布</li>
          <li>支持基础会议记录功能</li>
          <li>智能语音识别转写</li>
        </ul>
      </div>
      <!-- 可以添加更多更新记录 -->
    </div>
  </div>
</template>

<style scoped>
.updates-page {
  z-index: 2;
  padding: 2rem;
  color: white;
}

.updates-content {
  max-width: 800px;
  margin: 0 auto;
}

.update-item {
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.update-item ul {
  margin: 1rem 0;
}
</style>
