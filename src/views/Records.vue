<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import {
  getMeetings,
  getMeetingFiles,
  type Meeting,
  type MeetingFile,
  type CreateMeetingData,
} from '@/services/api'
import CreateMeetingModal from '@/components/CreateMeetingModal.vue'
import MeetingCard from '@/components/MeetingCard.vue'

interface MeetingWithFiles extends Meeting {
  files: MeetingFile[]
}

const authStore = useAuthStore()
const meetings = ref<MeetingWithFiles[]>([])
const loading = ref(true)
const showCreateMeetingModal = ref(false)

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
    console.error('获取会议列表失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchMeetingsAndFiles()
})
</script>

<template>
  <div class="records-page" v-if="authStore.isAuthenticated">
    <div class="header">
      <h1>会议文件</h1>
      <button class="create-meeting-btn" @click="showCreateMeetingModal = true">新建会议</button>
    </div>

    <!-- 新建会议模态框 -->
    <CreateMeetingModal v-model="showCreateMeetingModal" @refresh="fetchMeetingsAndFiles" />

    <div v-if="loading" class="loading">加载中...</div>
    <div v-else class="meetings-container">
      <MeetingCard
        v-for="meeting in meetings"
        :key="meeting.meetingid"
        :meeting="meeting"
        @refresh="fetchMeetingsAndFiles"
      />
    </div>
    <div class="spacer" />
  </div>
  <div class="unauthorized" v-else>
    <h1>请先登录</h1>
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

.spacer {
  margin-bottom: 20%;
}

.unauthorized {
  margin-top: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
