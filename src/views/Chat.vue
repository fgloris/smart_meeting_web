<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import {
  getFriends,
  getChatHistory,
  sendMessage,
  getUnreadMessages,
  markAllAsRead,
  type Friend,
  type Message,
} from '@/services/api'

const authStore = useAuthStore()
const friends = ref<Friend[]>([])
const currentFriend = ref<Friend | null>(null)
const messages = ref<Message[]>([])
const newMessage = ref('')
const loading = ref(false)
const unreadCounts = ref<{ [key: number]: number }>({})

// 获取好友列表
const fetchFriends = async () => {
  if (!authStore.user?.uid) {
    console.error('获取好友列表失败：用户未登录')
    return
  }
  console.info('开始获取好友列表，用户ID:', authStore.user.uid)
  try {
    const response = await getFriends(authStore.user.uid)
    console.info('获取好友列表成功:', response)
    friends.value = response.friends
    console.info('好友列表数据:', friends.value)
    // 获取每个好友的未读消息数
    for (const friend of friends.value) {
      console.info('获取好友未读消息数，好友ID:', friend.user_id)
      const unread = await getUnreadMessages(authStore.user!.uid)
      console.info('好友未读消息数:', unread)
      unreadCounts.value[friend.user_id] = unread.count
    }
  } catch (error) {
    console.error('获取好友列表失败:', error)
  }
}

// 获取聊天记录
const fetchChatHistory = async (friendId: number) => {
  if (!authStore.user?.uid) {
    console.error('获取聊天记录失败：用户未登录')
    return
  }
  console.info('开始获取聊天记录，用户ID:', authStore.user.uid, '好友ID:', friendId)
  loading.value = true
  try {
    const response = await getChatHistory(authStore.user.uid, friendId)
    console.info('获取聊天记录成功:', response)
    messages.value = response.history
    console.info('聊天记录数据:', messages.value)
    // 标记所有消息为已读
    console.info('开始标记消息为已读')
    await markAllAsRead(authStore.user.uid, friendId)
    console.info('标记消息已读成功')
    unreadCounts.value[friendId] = 0
  } catch (error) {
    console.error('获取聊天记录失败:', error)
  } finally {
    loading.value = false
  }
}

// 发送消息
const handleSendMessage = async () => {
  if (!newMessage.value.trim() || !currentFriend.value || !authStore.user?.uid) {
    console.error('发送消息失败：消息为空或未选择好友或用户未登录')
    return
  }
  console.info(
    '开始发送消息，发送者ID:',
    authStore.user.uid,
    '接收者ID:',
    currentFriend.value.user_id,
  )

  try {
    await sendMessage(authStore.user.uid, currentFriend.value.user_id, newMessage.value)
    console.info('发送消息成功')
    newMessage.value = ''
    // 重新获取聊天记录
    console.info('重新获取聊天记录')
    await fetchChatHistory(currentFriend.value.user_id)
  } catch (error) {
    console.error('发送消息失败:', error)
  }
}

// 选择好友
const selectFriend = async (friend: Friend) => {
  console.info('选择好友:', friend)
  currentFriend.value = friend
  await fetchChatHistory(friend.user_id)
}

// 定期检查未读消息
let checkInterval: number | null = null
const startCheckingUnread = () => {
  console.info('开始定期检查未读消息')
  checkInterval = window.setInterval(async () => {
    if (!authStore.user?.uid) {
      console.error('检查未读消息失败：用户未登录')
      return
    }
    console.info('检查未读消息，用户ID:', authStore.user.uid)
    for (const friend of friends.value) {
      console.info('检查好友未读消息，好友ID:', friend.user_id)
      const unread = await getUnreadMessages(authStore.user.uid)
      console.info('好友未读消息数:', unread)
      unreadCounts.value[friend.user_id] = unread.count
    }
  }, 5000) // 每5秒检查一次
}

onMounted(() => {
  console.info('Chat组件已挂载')
  fetchFriends()
  startCheckingUnread()
})

onUnmounted(() => {
  console.info('Chat组件即将卸载')
  if (checkInterval) {
    clearInterval(checkInterval)
  }
})
</script>

<template>
  <div class="chat-page">
    <div class="chat-container">
      <!-- 好友列表 -->
      <div class="friends-list">
        <h2>好友列表</h2>
        <div class="friends">
          <div
            v-for="friend in friends"
            :key="friend.user_id"
            class="friend-item"
            :class="{ active: currentFriend?.user_id === friend.user_id }"
            @click="selectFriend(friend)"
          >
            <div class="friend-avatar">
              <img :src="friend.avatar" :alt="friend.nickname" />
            </div>
            <div class="friend-info">
              <span class="friend-name">{{ friend.nickname }}</span>
              <span v-if="unreadCounts[friend.user_id]" class="unread-count">
                {{ unreadCounts[friend.user_id] }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 聊天窗口 -->
      <div class="chat-window">
        <div v-if="currentFriend" class="chat-header">
          <h3>{{ currentFriend.nickname }}</h3>
        </div>
        <div v-else class="no-chat-selected">
          <p>请选择一个好友开始聊天</p>
        </div>

        <div v-if="currentFriend" class="messages-container">
          <div v-if="loading" class="loading">加载中...</div>
          <div v-else class="messages">
            <div
              v-for="message in messages"
              :key="message.id"
              class="message"
              :class="{ 'message-sent': message.sender_id === authStore.user?.uid }"
            >
              <div class="message-content">{{ message.content }}</div>
              <div class="message-time">
                {{ new Date(message.created_at).toLocaleTimeString() }}
              </div>
            </div>
          </div>
        </div>

        <div v-if="currentFriend" class="message-input">
          <input
            v-model="newMessage"
            type="text"
            placeholder="输入消息..."
            @keyup.enter="handleSendMessage"
          />
          <button @click="handleSendMessage">发送</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-page {
  height: 100vh;
  padding: 2rem;
  color: white;
  margin-left: 6%;
}

.chat-container {
  display: flex;
  height: calc(100vh - 4rem);
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

.friends-list {
  width: 200px;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
}

.friends-list h2 {
  padding: 1rem;
  margin: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.friends {
  flex: 1;
  overflow-y: auto;
}

.friend-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.friend-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.friend-item.active {
  background: rgba(149, 128, 255, 0.2);
}

.friend-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 1rem;
}

.friend-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.friend-info {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.friend-name {
  font-weight: 500;
}

.unread-count {
  background: #ff6b6b;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 10px;
  font-size: 0.8rem;
}

.chat-window {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.chat-header {
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.chat-header h3 {
  margin: 0;
}

.no-chat-selected {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.5);
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.messages {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message {
  max-width: 70%;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  align-self: flex-start;
}

.message-sent {
  background: rgba(149, 128, 255, 0.3);
  align-self: flex-end;
}

.message-content {
  margin-bottom: 0.3rem;
}

.message-time {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
}

.message-input {
  padding: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  gap: 0.5rem;
}

.message-input input {
  flex: 1;
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.message-input input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.15);
}

.message-input button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background: rgba(149, 128, 255, 0.6);
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

.message-input button:hover {
  background: rgba(149, 128, 255, 0.8);
}

.loading {
  text-align: center;
  padding: 2rem;
  color: rgba(255, 255, 255, 0.6);
}
</style>
