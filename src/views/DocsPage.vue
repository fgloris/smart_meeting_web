<script setup lang="ts">
import { ref, onMounted } from 'vue'

const animateBackground = ref(false)

onMounted(() => {
  // 页面加载后延迟启动背景动画，提高性能
  setTimeout(() => {
    animateBackground.value = true
  }, 800)
})
</script>

<template>
  <div class="download-page">
    <!-- 背景动效元素 -->
    <div class="page-bg-elements" :class="{ 'animate': animateBackground }">
      <div class="bg-shape shape-1"></div>
      <div class="bg-shape shape-2"></div>
      <div class="bg-shape shape-3"></div>
      <div class="bg-line line-1"></div>
      <div class="bg-line line-2"></div>
      <div class="bg-line line-3"></div>
    </div>
    
    <div class="hero-section">
      <div class="left-content">
        <h1 class="title">智能会议助手</h1>
        <p class="subtitle">提升您的会议效率，让沟通更加智能</p>
        <div class="features">
          <div class="feature-item">
            <span class="feature-icon">📝</span>
            <span>自动记录会议内容</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">🔍</span>
            <span>智能搜索关键信息</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">📊</span>
            <span>会议数据可视化</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">🔔</span>
            <span>会议提醒与通知</span>
          </div>
        </div>
        <div class="download-actions">
          <a href="/assets/smartmeeting.apk" download="智能会议助手.apk" class="download-button android">
            <div class="download-logo">
              <img src="/src/assets/ic_launcher.png" alt="智能会议助手" class="app-logo">
            </div>
            <div class="download-text">
              <span class="download-label">下载</span>
              <span class="download-platform">Android v1.0.0</span>
            </div>
          </a>
          <a href="#" class="download-button ios coming-soon">
            <div class="download-logo">
              <span class="apple-logo">𝍆</span>
            </div>
            <div class="download-text">
              <span class="download-label">即将推出</span>
              <span class="download-platform">iOS 版本</span>
            </div>
          </a>
        </div>
        <div class="qrcode-container">
          <div class="qrcode-wrapper">
            <div class="qrcode-placeholder">
              <span class="qr-text">扫码下载</span>
            </div>
            <p class="qrcode-tip">使用手机扫描二维码下载</p>
          </div>
        </div>
      </div>
      <div class="right-content">
        <div class="app-preview">
          <img src="/src/assets/ic_launcher.png" alt="应用预览" class="preview-image">
          <div class="preview-shadow"></div>
          
          <!-- 添加浮动技术标签 -->
          <div class="tech-tags">
            <div class="tech-tag tag-1">AI语音识别</div>
            <div class="tech-tag tag-2">实时翻译</div>
            <div class="tech-tag tag-3">智能总结</div>
            <div class="tech-tag tag-4">云端存储</div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="app-description">
      <h2>为什么选择智能会议助手？</h2>
      <p>智能会议助手是一款专为提高会议效率设计的应用程序。它能自动记录会议内容，智能分析会议要点，并提供简洁明了的会议摘要。无论是远程会议还是面对面沟通，智能会议助手都能帮助您更好地组织和管理会议信息。</p>
      
      <div class="app-features">
        <div class="feature-card">
          <div class="feature-icon-large">🤖</div>
          <h3>AI 语音识别</h3>
          <p>采用先进的人工智能语音识别技术，准确记录会议内容，支持多人对话识别。</p>
          <div class="feature-glow"></div>
        </div>
        <div class="feature-card">
          <div class="feature-icon-large">💬</div>
          <h3>实时翻译</h3>
          <p>支持多语言实时翻译功能，打破语言障碍，促进全球团队协作。</p>
          <div class="feature-glow"></div>
        </div>
        <div class="feature-card">
          <div class="feature-icon-large">📈</div>
          <h3>数据分析</h3>
          <p>通过会议数据分析，洞察团队沟通模式，提供优化建议。</p>
          <div class="feature-glow"></div>
        </div>
      </div>
    </div>
    
    <div class="download-footer">
      <div class="version-info">
        <h3>版本信息</h3>
        <div class="version-item">
          <span class="version-label">当前版本:</span>
          <span class="version-value">v1.0.0 (2023年10月发布)</span>
        </div>
        <div class="version-item">
          <span class="version-label">适用系统:</span>
          <span class="version-value">Android 7.0及以上</span>
        </div>
        <div class="version-item">
          <span class="version-label">应用大小:</span>
          <span class="version-value">15.8 MB</span>
        </div>
      </div>
      <div class="download-cta">
        <p>立即下载，体验高效会议!</p>
        <a href="/assets/smartmeeting.apk" download="智能会议助手.apk" class="download-button-small">
          <span class="download-icon-small">↓</span>
          下载应用
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.download-page {
  padding: 0.5rem;
  position: relative;
  overflow: hidden;
}

/* 背景元素 */
.page-bg-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
  opacity: 0;
  transition: opacity 1s ease;
}

.page-bg-elements.animate {
  opacity: 1;
}

.bg-shape {
  position: absolute;
  filter: blur(80px);
  opacity: 0.05;
}

.shape-1 {
  top: -10%;
  right: -5%;
  width: 40%;
  height: 50%;
  background: radial-gradient(circle at center, var(--primary-color) 0%, transparent 70%);
  animation: float 30s infinite alternate ease-in-out;
}

.shape-2 {
  bottom: 20%;
  left: -10%;
  width: 50%;
  height: 40%;
  background: radial-gradient(circle at center, var(--secondary-color) 0%, transparent 70%);
  animation: float 40s infinite alternate-reverse ease-in-out;
}

.shape-3 {
  bottom: -15%;
  right: 10%;
  width: 45%;
  height: 45%;
  background: radial-gradient(circle at center, var(--accent-color) 0%, transparent 70%);
  animation: float 35s infinite alternate ease-in-out;
}

.bg-line {
  position: absolute;
  background: linear-gradient(90deg, transparent, rgba(66, 133, 244, 0.1), transparent);
  height: 1px;
  width: 100%;
  transform-origin: left;
  opacity: 0;
  transition: opacity 1.5s ease;
}

.page-bg-elements.animate .bg-line {
  opacity: 0.6;
}

.line-1 {
  top: 15%;
  transform: rotate(-5deg);
  animation: slide 60s infinite linear;
}

.line-2 {
  top: 45%;
  transform: rotate(2deg);
  animation: slide 80s infinite linear reverse;
}

.line-3 {
  top: 75%;
  transform: rotate(-3deg);
  animation: slide 70s infinite linear;
}

@keyframes slide {
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: 100% 0%;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(30px);
  }
}

.hero-section {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 2rem;
  margin-bottom: 3rem;
  position: relative;
  z-index: 1;
}

.left-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.right-content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.title {
  font-size: 3rem;
  font-weight: 700;
  background: linear-gradient(90deg, var(--primary-color, #4285f4), var(--secondary-color, #34a853));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin: 0;
  position: relative;
}

.title::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 100px;
  height: 3px;
  background: linear-gradient(90deg, var(--primary-color, #4285f4), transparent);
  border-radius: 3px;
}

.subtitle {
  font-size: 1.2rem;
  color: var(--text-color-light);
  margin: 0;
  line-height: 1.5;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background-color: rgba(66, 133, 244, 0.08);
  border-radius: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px var(--shadow-color);
}

.feature-item:hover {
  background-color: rgba(66, 133, 244, 0.12);
  transform: translateY(-3px);
  box-shadow: 0 4px 15px var(--shadow-color);
}

.feature-icon {
  font-size: 1.2rem;
}

.download-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
}

.download-button {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.3s ease;
  min-width: 200px;
  position: relative;
  overflow: hidden;
}

.download-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: all 0.5s ease;
}

.download-button:hover::before {
  left: 100%;
}

.download-button.android {
  background-color: var(--primary-color, #4285f4);
  color: white;
  box-shadow: 0 4px 12px rgba(66, 133, 244, 0.3);
}

.download-button.ios {
  background-color: #000000;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.download-button.coming-soon {
  opacity: 0.7;
  cursor: default;
}

.download-button:hover:not(.coming-soon) {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(66, 133, 244, 0.3);
}

.qrcode-container {
  margin-top: 1.5rem;
  display: flex;
  justify-content: flex-start;
}

.qrcode-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.qrcode-placeholder {
  width: 120px;
  height: 120px;
  background-color: rgba(66, 133, 244, 0.08);
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.5rem;
  border: 1px dashed rgba(66, 133, 244, 0.3);
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px var(--shadow-color);
}

.qrcode-placeholder:hover {
  background-color: rgba(66, 133, 244, 0.12);
  border-color: rgba(66, 133, 244, 0.5);
}

.qr-text {
  font-size: 0.9rem;
  color: var(--text-color-light);
}

.qrcode-tip {
  font-size: 0.8rem;
  color: var(--text-color-light);
  margin: 0;
}

.download-logo {
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.app-logo {
  width: 100%;
  height: auto;
}

.apple-logo {
  font-size: 2rem;
}

.download-text {
  display: flex;
  flex-direction: column;
}

.download-label {
  font-size: 0.75rem;
  opacity: 0.8;
}

.download-platform {
  font-size: 1rem;
  font-weight: 600;
}

.app-preview {
  position: relative;
  width: 300px;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.preview-image {
  width: 75%;
  height: auto;
  z-index: 1;
  animation: float 6s ease-in-out infinite;
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.15));
}

.preview-shadow {
  position: absolute;
  bottom: 0;
  width: 70%;
  height: 20px;
  background: rgba(66, 133, 244, 0.2);
  filter: blur(15px);
  border-radius: 50%;
  z-index: 0;
  animation: shadow 6s ease-in-out infinite;
}

/* 浮动技术标签 */
.tech-tags {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.tech-tag {
  position: absolute;
  padding: 0.5rem 1rem;
  background-color: var(--card-background);
  color: var(--text-color);
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  box-shadow: 0 4px 12px var(--shadow-color);
  animation: float 6s infinite ease-in-out;
  white-space: nowrap;
  border: 1px solid var(--border-color);
}

.tag-1 {
  top: 15%;
  left: 0;
  animation-delay: 0s;
  color: white;
  background: linear-gradient(90deg, rgba(66, 133, 244, 0.9), rgba(66, 133, 244, 0.7));
}

.tag-2 {
  top: 40%;
  right: 0;
  animation-delay: 1s;
  color: white;
  background: linear-gradient(90deg, rgba(52, 168, 83, 0.9), rgba(52, 168, 83, 0.7));
}

.tag-3 {
  bottom: 30%;
  left: 5%;
  animation-delay: 2s;
  color: white;
  background: linear-gradient(90deg, rgba(234, 67, 53, 0.9), rgba(234, 67, 53, 0.7));
}

.tag-4 {
  bottom: 10%;
  right: 5%;
  animation-delay: 3s;
  color: white;
  background: linear-gradient(90deg, rgba(251, 188, 5, 0.9), rgba(251, 188, 5, 0.7));
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes shadow {
  0%, 100% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(0.8);
    opacity: 0.2;
  }
}

.app-description {
  margin-top: 4rem;
  position: relative;
  z-index: 1;
}

.app-description h2 {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-align: center;
  background: linear-gradient(90deg, var(--primary-color, #4285f4), var(--secondary-color, #34a853));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  display: inline-block;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
}

.app-description h2::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 25%;
  width: 50%;
  height: 3px;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
  border-radius: 3px;
}

.app-description p {
  font-size: 1.1rem;
  line-height: 1.6;
  color: var(--text-color-light);
  text-align: center;
  max-width: 800px;
  margin: 0 auto 2rem;
}

.app-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.feature-card {
  background-color: var(--card-background);
  border-radius: 12px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: transform 0.3s ease;
  position: relative;
  overflow: hidden;
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 20px var(--shadow-color);
}

.feature-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80%;
  height: 100px;
  background: radial-gradient(circle at center, rgba(66, 133, 244, 0.1), transparent 70%);
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.5s ease;
  z-index: 0;
}

.feature-card:hover {
  transform: translateY(-5px);
  background-color: var(--card-background);
  box-shadow: 0 10px 30px var(--shadow-color);
  border-color: rgba(66, 133, 244, 0.3);
}

.feature-card:hover .feature-glow {
  opacity: 1;
}

.feature-icon-large {
  font-size: 3rem;
  margin-bottom: 1rem;
  position: relative;
  z-index: 1;
}

.feature-card h3 {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  position: relative;
  z-index: 1;
  color: var(--text-color);
}

.feature-card p {
  font-size: 0.95rem;
  line-height: 1.5;
  color: var(--text-color-light);
  position: relative;
  z-index: 1;
}

.download-footer {
  margin-top: 4rem;
  padding: 2rem;
  background-color: var(--card-background);
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;
  border: 1px solid var(--border-color);
  overflow: hidden;
  box-shadow: 0 4px 20px var(--shadow-color);
}

.download-footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(66, 133, 244, 0.05), transparent);
  z-index: -1;
}

.version-info h3 {
  font-size: 1.2rem;
  margin-top: 0;
  margin-bottom: 1rem;
  color: var(--primary-color, #4285f4);
}

.version-item {
  margin-bottom: 0.5rem;
  display: flex;
  gap: 0.5rem;
}

.version-label {
  color: var(--text-color-light);
}

.version-value {
  font-weight: 500;
  color: var(--text-color);
}

.download-cta {
  text-align: center;
}

.download-cta p {
  margin-bottom: 1rem;
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--text-color);
}

.download-button-small {
  background-color: var(--primary-color, #4285f4);
  color: white;
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(66, 133, 244, 0.3);
}

.download-button-small::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: all 0.5s ease;
}

.download-button-small:hover::before {
  left: 100%;
}

.download-button-small:hover {
  background-color: var(--secondary-color, #34a853);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(52, 168, 83, 0.3);
}

.download-icon-small {
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .hero-section {
    flex-direction: column;
    gap: 2rem;
  }

  .title {
    font-size: 2.2rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .features {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  }

  .app-features {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .download-footer {
    flex-direction: column;
    gap: 2rem;
    text-align: center;
  }
  
  .version-item {
    justify-content: center;
  }
  
  .right-content {
    display: none;
  }
  
  .qrcode-container {
    justify-content: center;
  }
  
  .app-description h2 {
    font-size: 1.8rem;
  }
}

@media (max-width: 480px) {
  .download-actions {
    flex-direction: column;
    align-items: stretch;
  }
  
  .download-button {
    width: 100%;
    justify-content: center;
  }
  
  .title {
    font-size: 1.8rem;
  }
  
  .app-description h2 {
    font-size: 1.5rem;
  }
  
  .app-description p {
    font-size: 1rem;
  }
  
  .feature-card {
    padding: 1.5rem;
  }
  
  .download-footer {
    padding: 1.5rem;
  }
}
</style>
