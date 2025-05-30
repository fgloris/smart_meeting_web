<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import {
  getMeetings,
  getMeetingFiles,
  uploadMeetingFile,
  downloadMeetingFile,
  deleteMeetingFile,
  deleteMeeting,
  type Meeting,
  type MeetingFile,
} from '@/services/api'
import CreateMeetingModal from '@/components/CreateMeetingModal.vue'

interface MeetingWithFiles extends Meeting {
  files: MeetingFile[]
}

const authStore = useAuthStore()
const meetings = ref<MeetingWithFiles[]>([])
const loading = ref(true)
const fileInputs = ref<{ [key: number]: HTMLInputElement | null }>({})
const showCreateModal = ref(false)
const showDropdown = ref<number | null>(null)

// 获取所有会议和文件
const fetchMeetingsAndFiles = async () => {
  loading.value = true
  try {
    if (!authStore.isAuthenticated || !authStore.user?.uid) {
      console.error('未登录，无法获取会议列表')
      return
    }
    const meetingsData = await getMeetings(authStore.user.uid)
    const meetingsWithFiles = await Promise.all(
      meetingsData.meetings.map(async (meeting: Meeting) => {
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
  console.info('当前登录状态:', authStore.isAuthenticated)
  console.info('当前用户信息:', authStore.user)

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

const handleDownload = async (file: MeetingFile) => {
  try {
    const blob = await downloadMeetingFile(file.file_path)
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
    // 刷新文件列表
    await fetchMeetingsAndFiles()
  } catch (error) {
    console.error('文件删除失败:', error)
  }
}

const toggleDropdown = (meetingId: number) => {
  showDropdown.value = showDropdown.value === meetingId ? null : meetingId
}

const handleDeleteMeeting = async (meetingId: number) => {
  if (!confirm('确定要删除这个会议吗？')) {
    return
  }

  try {
    await deleteMeeting(meetingId)
    await fetchMeetingsAndFiles()
  } catch (error) {
    console.error('删除会议失败:', error)
  }
}

const handleInviteMember = (meetingId: number) => {
  // TODO: 实现邀请成员功能
  console.log('邀请成员', meetingId)
}

const formatFileSize = (size: number) => {
  if (size < 1024) return size + ' B'
  if (size < 1024 * 1024) return (size / 1024).toFixed(1) + ' KB'
  return (size / (1024 * 1024)).toFixed(1) + ' MB'
}

const handleCreateSuccess = () => {
  fetchMeetingsAndFiles()
}

onMounted(() => {
  fetchMeetingsAndFiles()
})
</script>

<template>
  <div class="records-page">
    <div class="header">
      <h1>会议文件</h1>
      <button class="create-meeting-btn" @click="showCreateModal = true">创建会议</button>
    </div>

    <CreateMeetingModal v-model="showCreateModal" @refresh="handleCreateSuccess" />

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
            <div class="dropdown-container">
              <button class="menu-btn" @click="toggleDropdown(meeting.id)">
                <img src="@/assets/bars.svg" alt="菜单" class="menu-icon" />
              </button>
              <div v-if="showDropdown === meeting.id" class="dropdown-menu">
                <button class="dropdown-item" @click="handleUpload(meeting.id)">
                  <img src="@/assets/upload.svg" alt="上传" class="icon" /> 上传文件
                </button>
                <button class="dropdown-item" @click="handleInviteMember(meeting.id)">
                  <img src="@/assets/users.svg" alt="用户" class="icon" /> 邀请成员
                </button>
                <button class="dropdown-item delete" @click="handleDeleteMeeting(meeting.id)">
                  <img src="@/assets/trash.svg" alt="删除" class="icon" /> 删除会议
                </button>
              </div>
            </div>
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
  padding: 1.5rem 2rem;
  color: var(--text-color);
  min-height: 100%;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: transparent;
}

.header {
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h1 {
  color: #1a73e8;
  font-weight: 700;
  margin: 0;
}

.meetings-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
  flex: 1;
  overflow-y: auto;
}

.meeting-section {
  background: var(--card-background, white);
  border-radius: 12px;
  padding: 1.5rem 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(66, 133, 244, 0.1);
  transition: all 0.3s ease;
  margin-bottom: 1.5rem;
}

.meeting-section:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(66, 133, 244, 0.1);
  border-color: rgba(66, 133, 244, 0.2);
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
  color: #1a73e8;
  font-weight: 600;
}

.meeting-info {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  color: #5f6368;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.meeting-actions {
  margin-left: 1rem;
}

.dropdown-container {
  position: relative;
}

.menu-btn {
  background: rgba(66, 133, 244, 0.1);
  border: none;
  color: var(--primary-color);
  font-size: l.25rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: background-color 0.3s;
}

.menu-btn:hover {
  background: rgba(66, 133, 244, 0.2);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: var(--card-background);
  border-radius: 8px;
  padding: 0.5rem;
  min-width: 150px;
  z-index: 1000;
  box-shadow: 0 4px 15px var(--shadow-color);
  border: 1px solid var(--border-color);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.5rem 1rem;
  border: none;
  background: none;
  color: #1a73e8;
  cursor: pointer;
  text-align: left;
  border-radius: 4px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.dropdown-item:hover {
  background: rgba(66, 133, 244, 0.08);
  transform: translateY(-1px);
}

.dropdown-item.delete {
  color: #ea4335;
}

.dropdown-item.delete:hover {
  background: rgba(234, 67, 53, 0.08);
}

.menu-icon {
  width: 20px;
  height: 20px;
  fill: rgba(0, 0, 0, 0.7);
}

.icon {
  width: 16px;
  height: 16px;
  fill: rgba(0, 0, 0, 0.7);
  margin-right: 5px;
  vertical-align: middle;
}

.dropdown-item.delete .icon {
  fill: #ff6b6b;
}

.upload-btn {
  padding: 0.5rem 1rem;
  background: var(--primary-color);
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.3s;
}

.upload-btn:hover {
  background: rgba(66, 133, 244, 0.8);
  transform: translateY(-2px);
}

.no-files {
  text-align: center;
  padding: 2rem;
  color: #5f6368;
  font-style: italic;
}

.file-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: rgba(250, 250, 250, 0.9);
  border-radius: 8px;
  transition: all 0.3s ease;
  border-left: 3px solid rgba(66, 133, 244, 0.5);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}

.file-item:hover {
  background: rgba(250, 250, 255, 0.95);
  transform: translateY(-2px);
  border-left-color: #1a73e8;
  box-shadow: 0 4px 12px rgba(66, 133, 244, 0.1);
}

.file-info {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  align-items: center;
}

.file-actions {
  display: flex;
  gap: 0.8rem;
}

.file-name {
  min-width: 200px;
  font-weight: 500;
  color: #202124;
}

.file-size {
  min-width: 80px;
  color: #5f6368;
}

.file-date {
  min-width: 150px;
  color: #5f6368;
}

.file-type {
  min-width: 60px;
  text-transform: uppercase;
  color: #1a73e8;
  font-weight: 500;
  font-size: 0.85rem;
}

.download-btn {
  padding: 0.4rem 1rem;
  background: var(--primary-color);
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
}

.download-btn:hover {
  background: rgba(66, 133, 244, 0.85);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(66, 133, 244, 0.2);
}

.delete-btn {
  padding: 0.4rem 1rem;
  background: white;
  border: 1px solid #ea4335;
  border-radius: 6px;
  color: #ea4335;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
}

.delete-btn:hover {
  background: rgba(234, 67, 53, 0.1);
  transform: translateY(-2px);
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #5f6368;
}

.create-meeting-btn {
  padding: 0.5rem 1.2rem;
  background: var(--primary-color);
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
  box-shadow: 0 4px 10px rgba(66, 133, 244, 0.2);
}

.create-meeting-btn:hover {
  background: rgba(66, 133, 244, 0.85);
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(66, 133, 244, 0.3);
}

@media (max-width: 768px) {
  .records-page {
    padding: 1rem;
    height: calc(100vh - 80px);
  }
  
  .meeting-section {
    padding: 1.5rem;
  }
  
  .meeting-info {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .file-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.7rem;
  }
  
  .file-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .file-actions {
    margin-top: 1rem;
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
}
</style>
