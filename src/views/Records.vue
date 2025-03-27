<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import {
  getMeetings,
  getMeetingFiles,
  uploadMeetingFile,
  downloadMeetingFile,
  deleteMeetingFile,
  createMeeting,
  type Meeting,
  type MeetingFile,
  type CreateMeetingData,
} from '@/services/api'
import CreateMeetingModal from '@/components/CreateMeetingModal.vue'

interface MeetingWithFiles extends Meeting {
  files: MeetingFile[]
}

const authStore = useAuthStore()
const meetings = ref<MeetingWithFiles[]>([])
const loading = ref(true)
const fileInputs = ref<{ [key: number]: HTMLInputElement | null }>({})
const showCreateMeetingModal = ref(false)
const newMeeting = ref<CreateMeetingData>({
  meetingid: 0,
  meetingname: '',
  meetinglocation: '',
  meetingtime: '',
  meetingmembers: [authStore.user?.uid || 0],
})

// 获取所有会议和文件
const fetchMeetingsAndFiles = async () => {
  loading.value = true
  try {
    const meetingsData = await getMeetings()
    const meetingsWithFiles = await Promise.all(
      meetingsData.map(async (meeting: Meeting) => {
        const filesData = await getMeetingFiles(meeting.id)
        return {
          ...meeting,
          files: filesData.files,
        }
      }),
    )
    meetings.value = meetingsWithFiles
  } catch (error) {
    console.error('Failed to fetch meetings and files:', error)
  } finally {
    loading.value = false
  }
}

const handleUpload = (meetingId: number) => {
  if (!authStore.isAuthenticated || !authStore.user) {
    console.error('未登录，无法上传文件')
    return
  }

  const fileInput = fileInputs.value[meetingId]
  console.info('文件输入元素:', fileInput)

  if (!fileInput) {
    console.error('未找到文件输入元素')
    return
  }

  fileInput.click()
  console.info('已触发文件选择对话框')
}

const handleFileSelect = async (event: Event, meetingId: number) => {
  console.info('文件选择事件触发，meetingId:', meetingId)

  const input = event.target as HTMLInputElement
  console.info('文件输入元素:', input)

  if (!input.files?.length) {
    console.info('未选择文件')
    return
  }

  const file = input.files[0]
  console.info('选择的文件:', {
    name: file.name,
    size: file.size,
    type: file.type,
  })

  loading.value = true

  try {
    if (!authStore.isAuthenticated || !authStore.user) {
      console.error('上传时检查到未登录状态')
      throw new Error('请先登录')
    }

    console.info('开始上传文件，参数:', {
      meetingId,
      uploaderId: authStore.user.uid,
      fileName: file.name,
    })

    await uploadMeetingFile(meetingId, authStore.user.uid, file)
    console.info('文件上传成功')

    // 刷新文件列表
    console.info('开始刷新文件列表')
    await fetchMeetingsAndFiles()
    console.info('文件列表刷新完成')
  } catch (error) {
    console.error('文件上传失败:', error)
  } finally {
    loading.value = false
    // 重置 input
    if (fileInputs.value[meetingId]) {
      fileInputs.value[meetingId]!.value = ''
      console.info('已重置文件输入框')
    }
  }
}

const handleCreateMeeting = async () => {
  if (!authStore.isAuthenticated || !authStore.user) {
    console.error('未登录，无法创建会议')
    return
  }

  // 验证必填字段
  if (
    !newMeeting.value.meetingid ||
    !newMeeting.value.meetingname ||
    !newMeeting.value.meetinglocation ||
    !newMeeting.value.meetingtime
  ) {
    console.error('请填写所有必填字段')
    return
  }

  try {
    // 确保 meetingid 是数字
    const meetingData = {
      ...newMeeting.value,
      meetingid: Number(newMeeting.value.meetingid),
      meetingmembers: [authStore.user.uid],
    }

    console.info('准备创建会议，数据:', meetingData)
    await createMeeting(meetingData)
    console.info('会议创建成功')

    showCreateMeetingModal.value = false
    await fetchMeetingsAndFiles()

    // 重置表单
    newMeeting.value = {
      meetingid: 0,
      meetingname: '',
      meetinglocation: '',
      meetingtime: '',
      meetingmembers: [authStore.user.uid],
    }
  } catch (error: any) {
    console.error('创建会议失败:', error)
    if (error.response?.data?.error) {
      alert(error.response.data.error)
    } else {
      alert('创建会议失败，请检查输入数据是否正确')
    }
  }
}

const handleDownload = async (file: MeetingFile) => {
  try {
    const blob = await downloadMeetingFile(file.id)
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = file.file_name
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  } catch (error) {
    console.error('文件下载失败:', error)
  }
}

const handleDelete = async (file: MeetingFile) => {
  if (!confirm('确定要删除这个文件吗？')) {
    return
  }

  try {
    await deleteMeetingFile(file.id)
    await fetchMeetingsAndFiles()
  } catch (error) {
    console.error('文件删除失败:', error)
  }
}

const formatFileSize = (size: number) => {
  if (size < 1024) return size + ' B'
  if (size < 1024 * 1024) return (size / 1024).toFixed(1) + ' KB'
  return (size / (1024 * 1024)).toFixed(1) + ' MB'
}

onMounted(() => {
  fetchMeetingsAndFiles()
})
</script>

<template>
  <div class="records-page">
    <div class="header">
      <h1>会议文件</h1>
      <button class="create-meeting-btn" @click="showCreateMeetingModal = true">新建会议</button>
    </div>

    <!-- 新建会议模态框 -->
    <CreateMeetingModal v-model="showCreateMeetingModal" @refresh="fetchMeetingsAndFiles" />

    <div v-if="loading" class="loading">加载中...</div>
    <div v-else class="meetings-container">
      <div v-for="meeting in meetings" :key="meeting.id" class="meeting-section">
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
              :ref="
                (el) => {
                  fileInputs[meeting.id] = el as HTMLInputElement
                  console.info('文件输入元素已绑定，meetingId:', meeting.id)
                }
              "
              type="file"
              @change="(e) => handleFileSelect(e, meeting.id)"
              style="display: none"
              accept=".ppt, .pptx, .xls, .xlsx, .png, .doc, .docx, .mp3, .mp4, .pdf, .txt, .jpg, .jpeg, .png, .gif, .zip, .rar"
            />
            <button class="upload-btn" @click="handleUpload(meeting.id)">上传文件</button>
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
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.meetings-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-left: 5%;
  margin-right: 7%;
}

.meeting-section {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1.5rem;
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

.loading {
  text-align: center;
  padding: 2rem;
  color: rgba(255, 255, 255, 0.6);
}

.create-meeting-btn {
  padding: 0.5rem 1rem;
  background: rgba(149, 128, 255, 0.6);
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  transition: all 0.3s;
}

.create-meeting-btn:hover {
  background: rgba(149, 128, 255, 0.8);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 8px;
  width: 400px;
  color: white;
}

.modal h2 {
  margin: 0 0 1.5rem 0;
  text-align: center;
}

.form-group {
  margin-bottom: 1rem;
}

.form-input {
  width: 100%;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: white;
}

.form-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.modal-buttons {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.confirm-btn {
  padding: 0.5rem 1rem;
  background: rgba(149, 128, 255, 0.6);
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
}

.confirm-btn:hover {
  background: rgba(149, 128, 255, 0.8);
}

.cancel-btn {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
}

.cancel-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
