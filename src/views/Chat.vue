<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import {
  getFriends,
  getChatHistory,
  sendMessage,
  getUnreadMessages,
  markAllAsRead,
  sendFriendRequest,
  getPendingRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  type Friend,
  type Message,
  type FriendRequest,
} from '@/services/api'

const authStore = useAuthStore()
const friends = ref<FriendRequest[]>([])
const currentFriend = ref<FriendRequest | null>(null)
const messages = ref<Message[]>([])
const newMessage = ref('')
const loading = ref(false)
const unreadCounts = ref<{ [key: number]: number }>({})
const showAddFriendModal = ref(false)
const newFriendEmail = ref('')
const pendingRequests = ref<FriendRequest[]>([])
const showPendingRequests = ref(false)

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
    friends.value = []
    for (const friend of response.friends) {
      friends.value.push({
        friend_id: friend.uid,
        friend_name: friend.username,
        friend_email: friend.useremail,
      })
    }
    console.info('好友列表数据:', friends.value)
    // 获取每个好友的未读消息数
    for (const friend of friends.value) {
      console.info('获取好友未读消息数，好友ID:', friend.friend_id)
      const unread = await getUnreadMessages(authStore.user!.uid)
      console.info('好友未读消息数:', unread)
      unreadCounts.value[friend.friend_id] = unread.count
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
    currentFriend.value.friend_id,
  )

  try {
    await sendMessage(authStore.user.uid, currentFriend.value.friend_id, newMessage.value)
    console.info('发送消息成功')
    newMessage.value = ''
    // 重新获取聊天记录
    console.info('重新获取聊天记录')
    await fetchChatHistory(currentFriend.value.friend_id)
  } catch (error) {
    console.error('发送消息失败:', error)
  }
}

// 选择好友
const selectFriend = async (friend: FriendRequest) => {
  console.info('选择好友:', friend)
  currentFriend.value = friend
  await fetchChatHistory(friend.friend_id)
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
      console.info('检查好友未读消息，好友ID:', friend.friend_id)
      const unread = await getUnreadMessages(authStore.user.uid)
      console.info('好友未读消息数:', unread)
      unreadCounts.value[friend.friend_id] = unread.count
    }
  }, 5000) // 每5秒检查一次
}

// 获取待处理的好友请求
const fetchPendingRequests = async () => {
  if (!authStore.user?.uid) return
  try {
    const response = await getPendingRequests(authStore.user.uid)
    pendingRequests.value = []
    for (const request of response.requests) {
      pendingRequests.value.push({
        friend_id: request.uid,
        friend_name: request.username,
        friend_email: request.useremail,
      })
    }
  } catch (error) {
    console.error('获取待处理好友请求失败:', error)
  }
}

// 处理好友请求
const handleFriendRequest = async (request: FriendRequest, accept: boolean) => {
  if (!authStore.user?.uid) return
  console.info('处理好友请求 request:', request)
  try {
    if (accept) {
      await acceptFriendRequest(authStore.user.uid, request.friend_id)
    } else {
      await rejectFriendRequest(authStore.user.uid, request.friend_id)
    }
    await fetchPendingRequests()
    await fetchFriends()
  } catch (error) {
    console.error('处理好友请求失败:', error)
  }
}

// 发送好友请求
const handleAddFriend = async () => {
  if (!authStore.user?.uid || !newFriendEmail.value.trim()) return
  try {
    await sendFriendRequest(authStore.user.uid, parseInt(newFriendEmail.value))
    newFriendEmail.value = ''
    showAddFriendModal.value = false
  } catch (error) {
    console.error('发送好友请求失败:', error)
  }
}

onMounted(() => {
  console.info('Chat组件已挂载')
  fetchFriends()
  fetchPendingRequests()
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
        <div class="friends-header">
          <h2>好友列表</h2>
          <div class="friends-actions">
            <button class="add-friend-btn" @click="showAddFriendModal = true">
              <unicon name="plus" fill="#9580FF"></unicon>
            </button>
            <button
              class="pending-requests-btn"
              @click="showPendingRequests = !showPendingRequests"
            >
              <unicon name="bell" fill="#9580FF"></unicon>
              <span v-if="pendingRequests.length" class="notification-badge">
                {{ pendingRequests.length }}
              </span>
            </button>
          </div>
        </div>

        <!-- 待处理的好友请求 -->
        <div v-if="showPendingRequests && pendingRequests.length > 0" class="pending-requests">
          <h3>待处理的好友请求</h3>
          <div v-for="request in pendingRequests" :key="request.friend_id" class="request-item">
            <div class="request-user">
              <div class="friend-avatar">
                {{ request.friend_name.charAt(0).toUpperCase() }}
              </div>
              <span>用户 {{ request.friend_email }} 请求添加您为好友</span>
            </div>
            <div class="request-actions">
              <button @click="handleFriendRequest(request, true)" class="accept-btn">接受</button>
              <button @click="handleFriendRequest(request, false)" class="reject-btn">拒绝</button>
            </div>
          </div>
        </div>

        <div class="friends">
          <div
            v-for="friend in friends"
            :key="friend.friend_id"
            class="friend-item"
            :class="{ active: currentFriend?.friend_id === friend.friend_id }"
            @click="selectFriend(friend)"
          >
            <div class="friend-avatar">
              {{ friend.friend_name.charAt(0).toUpperCase() }}
            </div>
            <div class="friend-info">
              <span class="friend-name">{{ friend.friend_name }}</span>
              <span v-if="unreadCounts[friend.friend_id]" class="unread-count">
                {{ unreadCounts[friend.friend_id] }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 聊天窗口 -->
      <div class="chat-window">
        <div v-if="currentFriend" class="chat-header">
          <h3>{{ currentFriend.friend_name }}</h3>
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

    <!-- 添加好友弹窗 -->
    <div v-if="showAddFriendModal" class="modal-overlay" @click="showAddFriendModal = false">
      <div class="modal-content" @click.stop>
        <h3>添加好友</h3>
        <div class="modal-body">
          <input
            v-model="newFriendEmail"
            type="text"
            placeholder="请输入好友的用户ID"
            @keyup.enter="handleAddFriend"
          />
          <div class="modal-actions">
            <button @click="showAddFriendModal = false">取消</button>
            <button @click="handleAddFriend">发送请求</button>
          </div>
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
  width: 250px;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
}

.friends-list h2 {
  padding: 1rem;
  margin: 0;
}

.friends-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.friends-actions {
  display: flex;
  gap: 0.5rem;
}

.add-friend-btn,
.pending-requests-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.add-friend-btn:hover,
.pending-requests-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.pending-requests {
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.pending-requests h3 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
}

.request-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

.request-actions {
  display: flex;
  gap: 0.5rem;
}

.accept-btn,
.reject-btn {
  padding: 0.2rem 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
}

.accept-btn {
  background: rgba(149, 128, 255, 0.6);
  color: white;
}

.reject-btn {
  background: rgba(255, 107, 107, 0.6);
  color: white;
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
  background: rgba(149, 128, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
  color: white;
  margin-right: 1rem;
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  padding: 1.5rem;
  min-width: 300px;
}

.modal-content h3 {
  margin: 0 0 1rem 0;
  color: white;
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.modal-body input {
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.modal-body input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.15);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.modal-actions button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.modal-actions button:first-child {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.modal-actions button:last-child {
  background: rgba(149, 128, 255, 0.6);
  color: white;
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ff6b6b;
  color: white;
  font-size: 0.7rem;
  padding: 0.1rem 0.3rem;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

.request-user {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
