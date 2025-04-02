<template>
  <div class="stream-page">
    <div class="stream-container">
      <div class="stream-header">
        <h1>直播间</h1>
        <div class="stream-status" :class="{ 'is-live': isLive }">
          {{ isLive ? '直播中' : '未开播' }}
        </div>
      </div>

      <div class="player-container">
        <video
          id="videoPlayer"
          ref="videoPlayer"
          class="video-player"
          autoplay
          controls
          muted
        ></video>
        <div v-if="!isLive" class="no-stream">
          <p>暂无直播，请稍后再试</p>
        </div>
      </div>

      <div class="stream-info">
        <div v-if="currentRoom" class="info-item">
          <span class="label">直播URL:</span>
          <span class="value">{{ getPlayUrl(currentRoom.stream) }}</span>
        </div>
        <div v-if="currentRoom" class="info-item">
          <span class="label">推流地址:</span>
          <span class="value">{{ getStreamUrl(currentRoom.stream, currentRoom.secret) }}</span>
        </div>
        <div class="stream-actions">
          <div v-if="!currentRoom" class="join-form">
            <input v-model="joinStream" placeholder="输入stream" class="join-input" />
            <input v-model="joinSecret" placeholder="输入secret" class="join-input" />
            <button @click="handleJoinRoom" class="join-btn">加入直播间</button>
            <button @click="handleCreateRoom" class="create-btn">创建直播间</button>
          </div>
          <button v-else @click="refreshStream" class="refresh-btn">刷新直播</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import flvjs from 'flv.js'
import {
  createLiveRoom,
  joinLiveRoom,
  getPlayUrl,
  getStreamUrl,
  type LiveRoom,
} from '@/services/api'

const videoPlayer = ref<HTMLVideoElement | null>(null)
const isLive = ref(false)
const currentRoom = ref<LiveRoom | null>(null)
const joinStream = ref('')
const joinSecret = ref('')
let flvPlayer: flvjs.Player | null = null

const createPlayer = async (stream: string) => {
  if (!flvjs.isSupported()) {
    console.error('您的浏览器不支持flv.js，无法播放直播流')
    return
  }

  if (flvPlayer) {
    destroyPlayer()
  }

  if (!videoPlayer.value) return

  try {
    // 创建FLV播放器实例
    flvPlayer = flvjs.createPlayer({
      type: 'flv',
      url: getPlayUrl(stream),
      isLive: true,
      hasAudio: true,
      hasVideo: true,
    })

    // 绑定播放器元素
    flvPlayer.attachMediaElement(videoPlayer.value)

    // 添加事件监听
    flvPlayer.on(flvjs.Events.LOADING_COMPLETE, () => {
      console.log('加载完成')
    })

    flvPlayer.on(flvjs.Events.ERROR, (errType: string, errDetail: unknown) => {
      console.error('播放器错误', errType, errDetail)
      isLive.value = false
    })

    // 开始加载
    flvPlayer.load()
    // 开始播放
    try {
      flvPlayer.play()
      console.log('开始播放')
      isLive.value = true
    } catch (e) {
      console.error('播放失败', e)
      isLive.value = false
    }
  } catch (error) {
    console.error('创建播放器失败', error)
    isLive.value = false
  }
}

const handleCreateRoom = async () => {
  try {
    const response = await createLiveRoom('智能会议直播间')
    currentRoom.value = response.data
    await createPlayer(response.data.stream)
  } catch (error) {
    console.error('创建直播间失败', error)
    isLive.value = false
  }
}

const handleJoinRoom = async () => {
  if (!joinStream.value || !joinSecret.value) {
    alert('请输入stream和secret')
    return
  }

  try {
    const response = await joinLiveRoom({
      stream: joinStream.value,
      secret: joinSecret.value,
    })

    if (response.code === 0 && response.data) {
      currentRoom.value = response.data
      await createPlayer(response.data.stream)
    } else {
      alert('加入直播间失败，请检查stream和secret是否正确')
    }
  } catch (error) {
    console.error('加入直播间失败', error)
    alert('加入直播间失败，请检查stream和secret是否正确')
    isLive.value = false
  }
}

const checkStreamStatus = async () => {
  try {
    if (flvPlayer) {
      isLive.value = flvPlayer.buffered.length > 0
    }
  } catch (error) {
    console.error('检查直播状态失败', error)
    isLive.value = false
  }
}

const destroyPlayer = () => {
  if (flvPlayer) {
    flvPlayer.pause()
    flvPlayer.unload()
    flvPlayer.detachMediaElement()
    flvPlayer.destroy()
    flvPlayer = null
  }
}

const refreshStream = () => {
  if (currentRoom.value) {
    destroyPlayer()
    setTimeout(() => {
      createPlayer(currentRoom.value!.stream)
    }, 1000)
  }
}

// 设置定期检查直播状态
let statusCheckInterval: number | null = null

onMounted(() => {
  statusCheckInterval = window.setInterval(checkStreamStatus, 10000) // 每10秒检查一次直播状态
})

onUnmounted(() => {
  destroyPlayer()
  if (statusCheckInterval) {
    clearInterval(statusCheckInterval)
  }
})
</script>

<style scoped>
.stream-page {
  z-index: 1;
  padding: 2rem;
  color: white;
  min-height: 100vh;
  background: transparent;
  margin-left: 7%;
}

.stream-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.stream-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stream-header h1 {
  margin: 0;
}

.stream-status {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  background: rgba(255, 107, 107, 0.4);
  color: white;
}

.stream-status.is-live {
  background: rgba(76, 217, 100, 0.4);
}

.player-container {
  position: relative;
  width: 100%;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  overflow: hidden;
  aspect-ratio: 16 / 9;
}

.video-player {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: black;
}

.no-stream {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.6);
  color: rgba(255, 255, 255, 0.7);
}

.stream-info {
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.info-item {
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  font-size: 0.9rem;
}

.label {
  font-weight: bold;
  margin-right: 0.5rem;
  min-width: 80px;
}

.value {
  color: rgba(255, 255, 255, 0.7);
}

.stream-actions {
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
}

.join-form {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.join-input {
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  width: 150px;
}

.join-input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.15);
}

.join-btn,
.create-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  transition: all 0.3s;
}

.join-btn {
  background: rgba(149, 128, 255, 0.6);
}

.create-btn {
  background: rgba(76, 217, 100, 0.6);
}

.join-btn:hover {
  background: rgba(149, 128, 255, 0.8);
}

.create-btn:hover {
  background: rgba(76, 217, 100, 0.8);
}

.refresh-btn {
  padding: 0.5rem 1rem;
  background: rgba(149, 128, 255, 0.6);
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  transition: all 0.3s;
}

.refresh-btn:hover {
  background: rgba(149, 128, 255, 0.8);
}
</style>
