<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import {
  getFriends,
  getChatHistory,
  sendMessage,
  getUnreadMessages,
  markMessageAsRead,
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
const messagesContainer = ref<HTMLElement | null>(null)
const showScrollBottom = ref(false)
const messageInput = ref<HTMLTextAreaElement | null>(null)

// 自动将新消息滚动到底部
const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    console.info('已滚动到底部:', messagesContainer.value.scrollHeight)
  }
}

// 处理消息容器滚动事件
const handleScroll = () => {
  if (!messagesContainer.value) return
  
  const scrollTop = messagesContainer.value.scrollTop
  const scrollHeight = messagesContainer.value.scrollHeight
  const clientHeight = messagesContainer.value.clientHeight
  
  // 如果滚动位置离底部超过200px，显示回到底部按钮
  showScrollBottom.value = (scrollHeight - scrollTop - clientHeight) > 200
}

// 点击回到底部按钮
const scrollToBottomBtn = () => {
  scrollToBottom()
  showScrollBottom.value = false
}

// 当消息列表变化时自动滚动到底部
watch(messages, () => {
  console.info('消息列表变化，准备滚动到底部')
  // 使用setTimeout确保DOM已完全更新
  setTimeout(scrollToBottom, 100)
}, { deep: true })

// 当选择一个好友时自动滚动到底部
watch(currentFriend, () => {
  console.info('切换好友，准备滚动到底部')
  // 当切换会话时给更多时间加载
  setTimeout(scrollToBottom, 300)
}, { deep: true })

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
    // 调用API获取聊天历史记录 GET /api/message/history/{user_id}/{friend_id}
    const response = await getChatHistory(authStore.user.uid, friendId)
    console.info('获取聊天记录成功:', response)
    messages.value = response.history
    console.info('聊天记录数据:', messages.value)
    
    // 标记与该用户的所有消息为已读 PUT /api/message/read-all
    console.info('开始标记消息为已读')
    await markAllAsRead(authStore.user.uid, friendId)
    console.info('标记消息已读成功')
    unreadCounts.value[friendId] = 0
    
    // 滚动到最新消息
    console.info('准备滚动到最新消息')
    setTimeout(scrollToBottom, 100)
  } catch (error) {
    console.error('获取聊天记录失败:', error)
  } finally {
    loading.value = false
  }
}

// 调整文本输入框高度
const adjustTextareaHeight = () => {
  if (!messageInput.value) return
  
  // 重置高度
  messageInput.value.style.height = 'auto'
  
  // 计算新高度，但限制最大高度
  const newHeight = Math.min(messageInput.value.scrollHeight, 120)
  messageInput.value.style.height = newHeight + 'px'
  
  // 如果文本框高度变化，可能需要调整滚动位置
  if (messagesContainer.value && newHeight > 60) {
    messagesContainer.value.style.height = `calc(100% - ${newHeight + 40}px)`
  } else if (messagesContainer.value) {
    messagesContainer.value.style.height = 'calc(100% - 60px)'
  }
}

// 修改发送消息函数，处理Enter键行为
const handleSendMessage = async () => {
  if (!newMessage.value.trim() || !currentFriend.value || !authStore.user?.uid) {
    console.error('发送消息失败：消息为空或未选择好友或用户未登录')
    return
  }
  
  const messageContent = newMessage.value.trim()
  newMessage.value = '' // 立即清空输入框，提升用户体验
  
  // 重置文本输入框高度
  if (messageInput.value) {
    messageInput.value.style.height = 'auto'
    if (messagesContainer.value) {
      messagesContainer.value.style.height = 'calc(100% - 60px)'
    }
  }
  
  // 添加临时消息到UI，提升用户体验
  const tempMessage: Message = {
    id: Date.now(), // 临时ID
    sender_id: authStore.user.uid,
    receiver_id: currentFriend.value.friend_id,
    content: messageContent,
    created_at: new Date().toISOString(),
    is_read: false
  }
  messages.value.push(tempMessage)
  
  // 滚动到底部
  scrollToBottom()
  
  try {
    console.info('发送消息:', messageContent, '发送者:', authStore.user.uid, '接收者:', currentFriend.value.friend_id)
    
    // 发送消息到API POST /api/message
    const response = await sendMessage(
      authStore.user.uid,
      currentFriend.value.friend_id,
      messageContent
    )
    
    console.info('消息发送成功，服务器响应:', response)
    
    // 将临时消息替换为服务器返回的消息
    if (response && response.msg) {
      // 找到并替换临时消息
      const tempIndex = messages.value.findIndex(msg => msg.id === tempMessage.id)
      if (tempIndex !== -1) {
        messages.value[tempIndex] = response.msg
      }
    }
  } catch (error: any) {
    console.error('发送消息失败:', error)
    
    // 显示错误消息
    let errorMessage = '消息发送失败'
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message
    } else if (error.message) {
      errorMessage = error.message
    }
    
    // 移除临时消息
    messages.value = messages.value.filter(msg => msg.id !== tempMessage.id)
    
    // 将错误消息添加回输入框，方便用户重新编辑
    newMessage.value = messageContent
    
    // 向用户显示错误信息
    alert(`发送失败: ${errorMessage}`)
    
    // 如果是"不是好友关系"错误，提示用户添加好友
    if (errorMessage.includes('不是好友关系')) {
      if (confirm('您与该用户不是好友关系，是否发送好友请求？')) {
        try {
          await sendFriendRequest(authStore.user.uid, currentFriend.value.friend_id)
          alert('好友请求已发送')
        } catch (friendError) {
          console.error('发送好友请求失败:', friendError)
          alert('发送好友请求失败')
        }
      }
    }
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
    
    try {
      // 获取未读消息 GET /api/message/unread/{user_id}
      const unreadResponse = await getUnreadMessages(authStore.user.uid)
      console.info('未读消息数据:', unreadResponse)
      
      if (unreadResponse && unreadResponse.unread) {
        // 更新未读消息计数
        const unreadMessages = unreadResponse.unread;
        
        // 重置未读计数
        for (const friend of friends.value) {
          unreadCounts.value[friend.friend_id] = 0;
        }
        
        // 根据未读消息更新计数
        unreadMessages.forEach((msg: Message) => {
          const senderId = msg.sender_id;
          if (unreadCounts.value[senderId] !== undefined) {
            unreadCounts.value[senderId]++;
          } else {
            unreadCounts.value[senderId] = 1;
          }
        });
        
        // 如果当前正在与发送未读消息的好友聊天，则更新聊天记录并标记为已读
        if (currentFriend.value && unreadCounts.value[currentFriend.value.friend_id] > 0) {
          await fetchChatHistory(currentFriend.value.friend_id);
        }
      }
    } catch (error) {
      console.error('获取未读消息失败:', error);
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

// 标记单条消息为已读的函数
const markAsRead = async (messageId: number) => {
  if (!authStore.user?.uid) return;
  
  try {
    // 调用API标记单条消息为已读 PUT /api/message/read/{message_id}
    await markMessageAsRead(messageId);
    console.info('消息已标记为已读, ID:', messageId);
  } catch (error) {
    console.error('标记消息为已读失败:', error);
  }
}

onMounted(() => {
  console.info('Chat组件已挂载')
  fetchFriends()
  fetchPendingRequests()
  startCheckingUnread()
  
  // 添加滚动监听
  if (messagesContainer.value) {
    messagesContainer.value.addEventListener('scroll', handleScroll)
  }
})

onUnmounted(() => {
  console.info('Chat组件即将卸载')
  if (checkInterval) {
    clearInterval(checkInterval)
  }
  
  // 移除滚动监听
  if (messagesContainer.value) {
    messagesContainer.value.removeEventListener('scroll', handleScroll)
  }
})
</script>

<template>
  <div class="chat-page">
    <!-- 聊天页面导航栏 -->
    <div class="chat-nav">
      <div class="nav-title">
        {{ currentFriend?.friend_name || '聊天' }}
      </div>
    </div>
    
    <div class="chat-container">
      <!-- 好友列表 -->
      <div class="friends-list">
        <div class="friends-header">
          <h2>好友列表</h2>
          <div class="friends-actions">
            <button class="add-friend-btn" @click="showAddFriendModal = true">
              <img src="@/assets/plus.svg" alt="添加" class="icon" />
            </button>
            <button
              class="pending-requests-btn"
              @click="showPendingRequests = !showPendingRequests"
            >
              <img src="@/assets/bell.svg" alt="通知" class="icon" />
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
        <div v-if="!currentFriend" class="no-chat-selected">
          <p>请选择一个好友开始聊天</p>
        </div>

        <template v-if="currentFriend">
          <div class="messages-container">
            <div v-if="loading" class="loading">
              <div class="loading-spinner"></div>
              <div>加载中...</div>
            </div>
            <div v-else ref="messagesContainer" class="messages" @scroll="handleScroll">
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
            
            <!-- 回到底部按钮 -->
            <div v-if="showScrollBottom" class="scroll-to-bottom" @click="scrollToBottomBtn">
              <div class="scroll-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </div>
          </div>

          <div class="message-input-container">
            <div class="message-toolbar">
              <button class="toolbar-btn emoji-btn" title="表情">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                  <line x1="9" y1="9" x2="9.01" y2="9"></line>
                  <line x1="15" y1="9" x2="15.01" y2="9"></line>
                </svg>
              </button>
              <button class="toolbar-btn" title="图片">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
              </button>
            </div>
            
            <div class="message-input">
              <textarea
                v-model="newMessage"
                placeholder="输入消息..."
                @keyup.enter.exact="handleSendMessage"
                @input="adjustTextareaHeight"
                ref="messageInput"
                rows="1"
              ></textarea>
              
              <button 
                @click="handleSendMessage"
                :class="{ 'active': newMessage.trim().length > 0 }"
              >
                <span>发送</span>
              </button>
            </div>
          </div>
        </template>
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
  height: 100vh; /* 使用视口高度 */
  width: calc(100% - 220px); /* 减去侧边栏宽度 */
  margin-left: 0; /* 不需要左边距，因为已经有侧边栏 */
  display: flex;
  flex-direction: column; /* 改为纵向布局 */
  overflow: hidden; /* 防止整体滚动 */
  padding: 0;
  position: fixed; /* 固定定位 */
  top: 0;
  left: 220px; /* 留出侧边栏的空间 */
  right: 0;
  bottom: 0;
  background-color: #ededed; /* 更接近微信的背景色 */
  z-index: 10; /* 确保在其他元素之上但不遮挡侧边栏 */
}

/* 聊天导航栏样式 */
.chat-nav {
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 15px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 10;
}

.nav-title {
  flex: 1;
  text-align: center;
  font-weight: 600;
  font-size: 16px;
  color: #000;
}

.chat-container {
  display: flex;
  max-width: 100%;
  width: 100%;
  height: calc(100vh - 50px); /* 减去导航栏高度 */
  flex: 1;
  overflow: hidden;
  border-radius: 0;
  border: none;
  background: #f5f5f5;
  position: relative;
  box-shadow: none;
}

.friends-list {
  width: 280px;
  min-width: 280px;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-right: 1px solid #e0e0e0;
  height: 100%;
  overflow: hidden;
}

.friends-list h2 {
  padding: 1rem;
  margin: 0;
  color: #1a73e8;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.friends-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e6e6e6;
  background-color: #f9f9f9;
}

.friends-header h2 {
  font-size: 1.1rem;
  margin: 0;
  color: #1a73e8;
  font-weight: 600;
}

.friends-actions {
  display: flex;
  gap: 0.5rem;
}

.add-friend-btn,
.pending-requests-btn {
  background: rgba(66, 133, 244, 0.08);
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
}

.add-friend-btn:hover,
.pending-requests-btn:hover {
  background: rgba(66, 133, 244, 0.15);
  transform: translateY(-2px);
}

.pending-requests {
  padding: 1.2rem;
  border-bottom: 1px solid var(--border-color);
  background: rgba(66, 133, 244, 0.03);
}

.pending-requests h3 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  color: #1a73e8;
}

.request-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem;
  background: var(--card-background);
  border-radius: 8px;
  margin-bottom: 0.8rem;
  box-shadow: 0 2px 10px var(--shadow-color);
  border: 1px solid var(--border-color);
}

.request-actions {
  display: flex;
  gap: 0.8rem;
}

.accept-btn,
.reject-btn {
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.3s ease;
}

.accept-btn {
  background: var(--primary-color);
  color: white;
}

.accept-btn:hover {
  background: rgba(66, 133, 244, 0.85);
  transform: translateY(-2px);
}

.reject-btn {
  background: white;
  color: #ea4335;
  border: 1px solid #ea4335;
}

.reject-btn:hover {
  background: rgba(234, 67, 53, 0.08);
  transform: translateY(-2px);
}

.friends {
  flex: 1;
  overflow-y: auto;
  height: 100%;
  scrollbar-width: thin;
  scrollbar-color: rgba(66, 133, 244, 0.2) transparent;
}

.friends::-webkit-scrollbar {
  width: 4px;
}

.friends::-webkit-scrollbar-track {
  background: transparent;
}

.friends::-webkit-scrollbar-thumb {
  background-color: rgba(66, 133, 244, 0.2);
  border-radius: 4px;
  border: transparent;
}

.friend-item {
  display: flex;
  align-items: center;
  padding: 0.8rem 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 1px solid rgba(66, 133, 244, 0.05);
  position: relative;
}

.friend-item:hover {
  background: rgba(66, 133, 244, 0.06);
}

.friend-item.active {
  background: rgba(66, 133, 244, 0.1);
  border-left: 3px solid #1aad19; /* 使用微信绿色 */
}

.friend-item.active::after {
  content: '';
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  border-right: 6px solid #fff;
}

.friend-avatar {
  width: 40px;
  height: 40px;
  border-radius: 4px; /* 微信头像是圆角方形 */
  background: #1aad19; /* 微信绿 */
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.1rem;
  color: white;
  margin-right: 0.8rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.friend-info {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.friend-name {
  font-weight: 500;
  color: #1a73e8;
}

.unread-count {
  background: #ea4335;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 500;
}

.chat-window {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  background-color: #ededed; /* 微信聊天背景色 */
  overflow: hidden;
}

.chat-header {
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.chat-header h3 {
  margin: 0;
  color: var(--primary-color);
}

.no-chat-selected {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
  font-style: normal;
  height: 100%;
  background-color: #f5f5f5;
}

.no-chat-selected::before {
  content: '💬';
  font-size: 3rem;
  margin-bottom: 1rem;
  animation: float 2s ease-in-out infinite;
}

.no-chat-selected p {
  font-size: 15px;
  color: #666;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.messages-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  background: #ededed;
  height: calc(100% - 60px);
  overflow: hidden;
  transition: height 0.2s;
}

.messages {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  padding: 1.2rem 1.5rem;
  max-width: 1120px;
  width: 100%;
  margin: 0 auto;
  overflow-y: auto;
  height: 100%;
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.1) transparent;
  -webkit-overflow-scrolling: touch; /* 提升iOS滚动体验 */
}

.messages::-webkit-scrollbar {
  width: 4px;
}

.messages::-webkit-scrollbar-track {
  background: transparent;
}

.messages::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  border: transparent;
}

.message {
  max-width: 60%;
  padding: 0.7rem 1rem;
  background: #fff;
  border-radius: 3px; /* 微信消息气泡圆角更小 */
  align-self: flex-start;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
  border: none; /* 微信消息气泡没有边框 */
  transition: transform 0.15s ease;
  font-size: 15px;
  animation: fade-in 0.2s ease-out;
  word-break: break-word;
  margin-bottom: 10px;
  position: relative;
}

.message:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.message-sent {
  background: #a0e75a; /* 更准确的微信绿色 */
  align-self: flex-end;
  border-radius: 3px;
  color: #000;
}

/* 添加微信消息气泡的小三角 */
.message:before {
  content: '';
  position: absolute;
  left: -8px;
  top: 12px;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
  border-right: 8px solid #fff;
}

.message-sent:before {
  left: auto;
  right: -8px;
  border-right: none;
  border-left: 8px solid #a0e75a;
}

.message-content {
  margin-bottom: 0.25rem;
  color: #000;
  line-height: 1.4;
}

.message-time {
  font-size: 0.7rem;
  color: #999;
  text-align: right;
}

.message-input-container {
  display: flex;
  flex-direction: column;
  border-top: 1px solid #e0e0e0;
  background: #f9f9f9;
  width: 100%;
  z-index: 5;
  box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.03);
}

.message-toolbar {
  display: flex;
  align-items: center;
  padding: 5px 15px;
  gap: 10px;
}

.toolbar-btn {
  background: transparent;
  border: none;
  border-radius: 4px;
  color: #666;
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.toolbar-btn:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #1aad19;
}

.message-input {
  padding: 5px 15px 10px;
  display: flex;
  gap: 10px;
  align-items: flex-end;
}

.message-input textarea {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  color: #333;
  transition: all 0.2s ease;
  font-size: 15px;
  resize: none;
  overflow-y: auto;
  line-height: 1.5;
  max-height: 120px;
}

.message-input textarea:focus {
  border-color: #1aad19;
  outline: none;
  box-shadow: 0 0 0 2px rgba(26, 173, 25, 0.1);
}

.message-input button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background: #f2f2f2;
  color: #999;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  min-width: 70px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.message-input button.active {
  background: #1aad19;
  color: white;
}

.message-input button.active:hover {
  background: #129611;
  transform: translateY(-1px);
}

.message-input button:active {
  transform: scale(0.98);
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #999;
  font-size: 14px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(3px);
}

.modal-content {
  background: var(--card-background);
  border-radius: 12px;
  padding: 1.5rem;
  min-width: 350px;
  box-shadow: 0 10px 30px var(--shadow-color);
  border: 1px solid var(--border-color);
}

.modal-content h3 {
  margin: 0 0 1.5rem 0;
  color: var(--primary-color);
  font-weight: 600;
  text-align: center;
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.modal-body input {
  padding: 0.8rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: rgba(250, 250, 250, 0.9);
  color: var(--text-color);
}

.modal-body input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.1);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.modal-actions button {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.modal-actions button:first-child {
  background: rgba(0, 0, 0, 0.05);
  color: var(--text-color);
}

.modal-actions button:first-child:hover {
  background: rgba(0, 0, 0, 0.1);
}

.modal-actions button:last-child {
  background: var(--primary-color);
  color: white;
}

.modal-actions button:last-child:hover {
  background: rgba(66, 133, 244, 0.85);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(66, 133, 244, 0.2);
}

.notification-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ea4335;
  color: white;
  font-size: 0.7rem;
  padding: 0.1rem 0.3rem;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
  z-index: 1;
  box-shadow: 0 2px 5px rgba(234, 67, 53, 0.3);
}

.request-user {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: #333;
  font-size: 0.92rem;
}

/* 移动设备适配 */
@media (max-width: 992px) {
  .chat-page {
    width: calc(100% - 60px);
    left: 60px;
  }
}

@media (max-width: 768px) {
  .chat-page {
    width: 100%;
    left: 0;
    z-index: 200; /* 在移动设备上提高优先级 */
  }
  
  .chat-container {
    height: calc(100vh - 50px); /* 减去导航栏高度 */
  }
  
  .friends-list {
    width: 100%;
    min-width: 100%;
    height: 200px;
    min-height: 200px;
    max-height: 200px;
    border-right: none;
    border-bottom: 1px solid rgba(66, 133, 244, 0.1);
  }
  
  .friends-header {
    padding: 0.7rem;
  }
  
  .friend-item {
    padding: 0.6rem 0.8rem;
  }
  
  .friend-avatar {
    width: 32px;
    height: 32px;
    font-size: 1rem;
    margin-right: 0.6rem;
  }
  
  .chat-window {
    max-width: 100%;
    height: calc(100vh - 250px); /* 减去导航栏和好友列表高度 */
  }
  
  .messages-container {
    height: calc(100% - 60px);
  }
  
  .messages {
    padding: 0.8rem;
    max-width: 100%; /* 移动设备上使用全宽 */
  }
  
  .message {
    max-width: 75%; /* 在移动设备上增加最大宽度比例 */
    padding: 0.6rem 0.8rem;
    font-size: 0.9rem;
  }
  
  .message-time {
    font-size: 0.7rem;
  }
  
  .message-input textarea {
    font-size: 14px;
    padding: 6px 10px;
  }
  
  .message-input button {
    min-width: 60px;
    padding: 6px 12px;
    font-size: 14px;
  }
  
  .toolbar-btn svg {
    width: 18px;
    height: 18px;
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 回到底部按钮 */
.scroll-to-bottom {
  position: absolute;
  right: 20px;
  bottom: 70px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 10;
  transition: all 0.2s ease;
  animation: fadeIn 0.3s ease;
}

.scroll-to-bottom:hover {
  background: rgba(0, 0, 0, 0.8);
  transform: translateY(-2px);
}

.scroll-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 加载动画 */
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #999;
  font-size: 14px;
  height: 100%;
}

.loading-spinner {
  width: 30px;
  height: 30px;
  border: 3px solid rgba(0,0,0,0.1);
  border-radius: 50%;
  border-top-color: #1aad19;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* 消息发送按钮效果 */
.message-input button:active {
  transform: scale(0.98);
}

.message-time {
  font-size: 0.65rem;
  color: #b2b2b2;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.icon {
  width: 20px;
  height: 20px;
  fill: #9580ff;
}

.add-friend-btn .icon,
.pending-requests-btn .icon {
  width: 20px;
  height: 20px;
}
</style>
