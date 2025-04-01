<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { createMeeting, type CreateMeetingData } from '@/services/api'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'refresh'): void
}>()

const authStore = useAuthStore()
const newMeeting = ref<CreateMeetingData>({
  meetingid: 1,
  meetingname: '',
  meetinglocation: '',
  meetingtime: '',
  meetingmembers: [authStore.user?.uid || 0],
})

const handleCreateMeeting = async () => {
  if (!authStore.isAuthenticated || !authStore.user) {
    console.error('未登录，无法创建会议')
    return
  }

  // 验证必填字段
  if (
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

    emit('update:modelValue', false)
    emit('refresh')

    // 重置表单
    newMeeting.value = {
      meetingid: 1,
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
</script>

<template>
  <div v-if="modelValue" class="modal-overlay">
    <div class="modal">
      <h2>新建会议</h2>
      <div class="form-group">
        <input
          v-model="newMeeting.meetingname"
          type="text"
          placeholder="会议名称"
          class="form-input"
          required
        />
      </div>
      <div class="form-group">
        <input
          v-model="newMeeting.meetinglocation"
          type="text"
          placeholder="会议地点"
          class="form-input"
          required
        />
      </div>
      <div class="form-group">
        <input v-model="newMeeting.meetingtime" type="datetime-local" class="form-input" required />
      </div>
      <div class="modal-buttons">
        <button class="confirm-btn" @click="handleCreateMeeting">确认</button>
        <button class="cancel-btn" @click="$emit('update:modelValue', false)">取消</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
