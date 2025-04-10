<script setup lang="ts">
import { useRouter } from 'vue-router'

defineProps<{
  Main: string
  Sub: string
}>()

const router = useRouter()

const goToDownloadPage = () => {
  router.push('/download')
}
</script>

<template>
  <div class="download-section">
    <button class="download-button" @click="goToDownloadPage">
      <div class="button-content">
        <div class="download-icon">↓</div>
        <div class="text-content">
          <span class="main-text">{{ Main }}</span>
          <span class="version">{{ Sub }}</span>
        </div>
      </div>
    </button>
  </div>
</template>

<style scoped>
.download-section {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.download-button {
  background: var(--primary-color, #4285f4);
  color: white;
  border: none;
  padding: 16px 36px;
  border-radius: 28px;
  font-size: 1.2em;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(66, 133, 244, 0.3);
  position: relative;
  overflow: hidden;
}

.download-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(66, 133, 244, 0.5);
  background: var(--secondary-color, #34a853);
}

.download-button:active {
  transform: translateY(-1px);
  box-shadow: 0 2px 10px rgba(66, 133, 244, 0.4);
}

.button-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.download-icon {
  font-size: 1.4em;
  animation: bounce 2s infinite;
}

.text-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.main-text {
  font-weight: 600;
  margin-bottom: 2px;
}

.version {
  font-size: 0.7em;
  opacity: 0.8;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}
</style>
