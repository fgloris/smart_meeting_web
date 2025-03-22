<template>
  <div class="download-page">
    <div class="container">
      <!-- 使用标准布局的主要内容区域 -->
      <div class="main-content">
        <!-- 应用信息 -->
        <div class="app-info">
          <div class="app-header">
            <!-- App Icon -->
            <div class="app-icon">
              <svg
                width="150"
                height="150"
                viewBox="0 0 150 150"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <!-- Placeholder for app icon -->
                <rect width="150" height="150" rx="24" fill="#f0f0f0" />
              </svg>
            </div>

            <div class="app-title-section">
              <h1 class="app-title">Smart Meeting</h1>
              <p class="app-description">
                智能会议系统 - 让您的会议更高效
              </p>
            </div>
          </div>

          <!-- 下载按钮 -->
          <div class="download-buttons">
            <!-- iOS Download -->
            <a href="#" class="download-button ios">
              <span class="platform">iOS</span>
              <span class="text">App Store 下载</span>
            </a>

            <!-- Android Download -->
            <a href="#" class="download-button android">
              <span class="platform">Android</span>
              <span class="text">安卓版下载</span>
            </a>
          </div>
        </div>

        <!-- 特性展示 -->
        <div class="features">
          <h2>主要功能</h2>
          <div class="feature-grid">
            <div class="feature-item">
              <h3>智能预约</h3>
              <p>便捷的会议室预约系统</p>
            </div>
            <div class="feature-item">
              <h3>会议管理</h3>
              <p>高效的会议组织与管理</p>
            </div>
            <div class="feature-item">
              <h3>实时协作</h3>
              <p>便捷的团队协作功能</p>
            </div>
            <div class="feature-item">
              <h3>智能提醒</h3>
              <p>及时的会议提醒服务</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DownloadPage',
}
</script>

<style scoped>
.download-page {
  min-height: 100vh;
  padding: 2rem;
  background-color: #f8f9fa;
  display: flex;
  justify-content: center;
  align-items: center;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.main-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
}

.app-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.app-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.app-icon {
  flex-shrink: 0;
}

.app-title {
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
}

.app-description {
  font-size: 1.2rem;
  color: #666;
}

.download-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.download-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 2rem;
  border-radius: 12px;
  text-decoration: none;
  color: white;
  transition: transform 0.2s;
  min-width: 180px;
}

.download-button:hover {
  transform: translateY(-2px);
}

.download-button.ios {
  background-color: #007AFF;
}

.download-button.android {
  background-color: #3DDC84;
}

.platform {
  font-size: 0.9rem;
  margin-bottom: 0.3rem;
}

.text {
  font-size: 1.1rem;
  font-weight: 600;
}

.features {
  width: 100%;
}

.features h2 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 2rem;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.feature-item {
  background-color: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.feature-item h3 {
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 1rem;
}

.feature-item p {
  color: #666;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .download-buttons {
    flex-direction: column;
    gap: 1rem;
  }

  .download-button {
    width: 100%;
    max-width: 300px;
  }
}
</style>