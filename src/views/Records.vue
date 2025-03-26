<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface FileItem {
  id: number;
  name: string;
  size: string;
  date: string;
  type: string;
}

const fileList = ref<FileItem[]>([]);
const loading = ref(true);

const fileInput = ref<HTMLInputElement | null>(null);

// 模拟从后端获取数据
const fetchFiles = async () => {
  loading.value = true;
  await new Promise(resolve => setTimeout(resolve, 1000));
  fileList.value = [
    { id: 1, name: '会议记录-2024-01.docx', size: '2.3MB', date: '2024-01-20', type: 'docx' },
    { id: 2, name: '会议录音-2024-01.mp3', size: '15.7MB', date: '2024-01-20', type: 'mp3' },
    { id: 3, name: '会议总结.pdf', size: '1.2MB', date: '2024-01-21', type: 'pdf' },
  ];
  loading.value = false;
};

const handleUpload = () => {
  fileInput.value?.click();
};

const handleFileSelect = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;

  const file = input.files[0];
  loading.value = true;

  // 模拟上传过程
  await new Promise(resolve => setTimeout(resolve, 1500));

  // 模拟上传成功，添加新文件到列表
  const newFile: FileItem = {
    id: fileList.value.length + 1,
    name: file.name,
    size: `${(file.size / (1024 * 1024)).toFixed(1)}MB`,
    date: new Date().toISOString().split('T')[0],
    type: file.name.split('.').pop() || ''
  };

  fileList.value = [newFile, ...fileList.value];
  loading.value = false;

  // 重置 input
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const handleDownload = (file: FileItem) => {
  // 模拟文件下载
  console.log('downloading...', file.name);
};

onMounted(() => {
  fetchFiles();
});
</script>

<template>
  <div class="records-page">
    <input
      ref="fileInput"
      type="file"
      @change="handleFileSelect"
      style="display: none"
      accept=".doc,.docx,.pdf,.mp3,.mp4"
    />
    <div class="header">
      <h1>会议文件</h1>
      <button class="upload-btn" @click="handleUpload">上传文件</button>
    </div>
    
    <div class="file-container">
      <transition-group name="list" tag="div" class="file-list">
        <div v-if="loading" key="loading" class="loading">加载中...</div>
        <div v-else v-for="file in fileList" 
             :key="file.id" 
             class="file-item">
          <div class="file-info">
            <span class="file-name">{{ file.name }}</span>
            <span class="file-size">{{ file.size }}</span>
            <span class="file-date">{{ file.date }}</span>
          </div>
          <button class="download-btn" @click="handleDownload(file)">下载</button>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<style scoped>
.records-page {
  position: relative;
  z-index: 1;
  padding: 2rem;
  color: white;
  min-height: 100vh;
  background: transparent;
  margin-left: 7%;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.upload-btn {
  padding: 0.5rem 1rem;
  background: rgba(149, 128, 255, 0.6);
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  transition: all 0.3s;
}

.upload-btn:hover {
  background: rgba(149, 128, 255, 0.8);
}

.file-container {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1rem;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s;
}

.file-item:hover {
  background: rgba(149, 128, 255, 0.1);
}

.file-info {
  display: flex;
  gap: 2rem;
}

.download-btn {
  padding: 0.3rem 0.8rem;
  background: rgba(149, 128, 255, 0.4);
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
}

.download-btn:hover {
  background: rgba(149, 128, 255, 0.6);
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.loading {
  text-align: center;
  padding: 2rem;
  color: rgba(255, 255, 255, 0.6);
}
</style>
