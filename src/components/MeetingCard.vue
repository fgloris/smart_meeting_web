<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import type { Meeting, MeetingFile } from '@/services/api'

const props = defineProps<{
  meeting: Meeting & { files: MeetingFile[] }
}>()

const emit = defineEmits<{
  (e: 'refresh'): void
}>()

const authStore = useAuthStore()
const fileInput = ref<HTMLInputElement | null>(null)

const handleFileSelect = (event: Event, meetingId: number) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    // TODO: 实现文件上传功能
    console.info('文件已选择，meetingId:', meetingId)
  }
}

const handleUpload = (meetingId: number) => {
  if (!authStore.isAuthenticated) {
    console.error('未登录，无法上传文件')
    return
  }
  fileInput.value?.click()
}

const handleDownload = (file: MeetingFile) => {
  // TODO: 实现文件下载功能
  console.info('准备下载文件:', file)
}

const handleDelete = (file: MeetingFile) => {
  // TODO: 实现文件删除功能
  console.info('准备删除文件:', file)
}

const formatFileSize = (size: number): string => {
  if (size < 1024) {
    return size + ' B'
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + ' KB'
  } else if (size < 1024 * 1024 * 1024) {
    return (size / (1024 * 1024)).toFixed(2) + ' MB'
  } else {
    return (size / (1024 * 1024 * 1024)).toFixed(2) + ' GB'
  }
}
</script>

<template>
  <div class="meeting-card">
    <div class="meeting-header">
      <div class="meeting-title">
        <h2>{{ meeting.meetingname }}</h2>
        <div class="meeting-info">
          <span>地点：{{ meeting.meetinglocation }}</span>
          <span>时间：{{ meeting.meetingtime }}</span>
          <span>参会人数：{{ meeting.meetingmember }}</span>
        </div>
      </div>
      <div class="meeting-actions">
        <input
          ref="fileInput"
          type="file"
          @change="(e) => handleFileSelect(e, meeting.meetingid)"
          style="display: none"
          accept=".ppt, .pptx, .xls, .xlsx, .png, .doc, .docx, .mp3, .mp4, .pdf, .txt, .jpg, .jpeg, .png, .gif, .zip, .rar"
        />
        <button class="upload-btn" @click="handleUpload(meeting.meetingid)">上传文件</button>
      </div>
    </div>

    <div v-if="meeting.files.length === 0" class="no-files">暂无文件</div>
    <div v-else class="file-list">
      <div v-for="file in meeting.files" :key="file.id" class="file-item">
        <div class="file-info">
          <span class="file-name">{{ file.file_name }}</span>
          <span class="file-size">{{ formatFileSize(file.file_size) }}</span>
          <span class="file-date">{{ file.upload_time }}</span>
          <span class="file-type">{{ file.file_type }}</span>
        </div>
        <div class="file-actions">
          <button class="download-btn" @click="handleDownload(file)">下载</button>
          <button class="delete-btn" @click="handleDelete(file)">删除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.meeting-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1.5rem;
  color: white;
}

.meeting-header {
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.meeting-title {
  flex: 1;
}

.meeting-header h2 {
  margin: 0 0 0.5rem 0;
  color: white;
}

.meeting-info {
  display: flex;
  gap: 1.5rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

.meeting-actions {
  margin-left: 1rem;
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

.no-files {
  text-align: center;
  padding: 2rem;
  color: rgba(255, 255, 255, 0.5);
  font-style: italic;
}

.file-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  transition: all 0.3s;
}

.file-item:hover {
  background: rgba(149, 128, 255, 0.1);
}

.file-info {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.file-actions {
  display: flex;
  gap: 0.5rem;
}

.file-name {
  min-width: 200px;
}

.file-size {
  min-width: 80px;
}

.file-date {
  min-width: 150px;
}

.file-type {
  min-width: 60px;
  text-transform: uppercase;
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

.delete-btn {
  padding: 0.3rem 0.8rem;
  background: rgba(255, 107, 107, 0.4);
  border: none;
  border-radius: 4px;
  color: #ff6b6b;
  cursor: pointer;
}

.delete-btn:hover {
  background: rgba(255, 107, 107, 0.6);
}
</style>
