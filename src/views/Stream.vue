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
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
  width: 100%;
  color: var(--text-color);
}

.stream-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  padding: 1rem;
  width: 100%;
}

.stream-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.stream-header h1 {
  margin: 0;
  color: #1a73e8;
  font-weight: 700;
}

.stream-status {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  background: rgba(234, 67, 53, 0.08);
  color: #ea4335;
  font-weight: 500;
  border: 1px solid rgba(234, 67, 53, 0.15);
}

.stream-status.is-live {
  background: rgba(52, 168, 83, 0.08);
  color: #34a853;
  border: 1px solid rgba(52, 168, 83, 0.15);
}

.player-container {
  position: relative;
  width: 100%;
  background: rgba(0, 0, 0, 0.03);
  border-radius: 12px;
  overflow: hidden;
  aspect-ratio: 16 / 9;
  border: 1px solid rgba(66, 133, 244, 0.1);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.player-container:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
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
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.2rem;
}

.stream-info {
  padding: 2rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  border: 1px solid rgba(66, 133, 244, 0.1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  margin-top: 1rem;
}

.info-item {
  margin-bottom: 1.2rem;
  display: flex;
  align-items: center;
  font-size: 0.95rem;
  border-left: 3px solid rgba(66, 133, 244, 0.3);
  padding-left: 0.8rem;
}

.label {
  font-weight: 600;
  margin-right: 1rem;
  min-width: 80px;
  color: #1a73e8;
}

.value {
  color: #5f6368;
  background: rgba(66, 133, 244, 0.05);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-family: monospace;
  word-break: break-all;
  flex: 1;
}

.stream-actions {
  margin-top: 2rem;
  display: flex;
  justify-content: flex-end;
}

.join-form {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  justify-content: center;
}

.join-input {
  padding: 0.7rem 1rem;
  border: 1px solid rgba(66, 133, 244, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.95);
  color: #202124;
  width: 180px;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.join-input:focus {
  outline: none;
  border-color: #1a73e8;
  box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.1);
}

.join-btn,
.create-btn {
  padding: 0.7rem 1.2rem;
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.join-btn {
  background: #1a73e8;
  box-shadow: 0 4px 10px rgba(26, 115, 232, 0.2);
}

.create-btn {
  background: #34a853;
  box-shadow: 0 4px 10px rgba(52, 168, 83, 0.2);
}

.join-btn:hover {
  background: #1967d2;
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 6px 12px rgba(26, 115, 232, 0.3);
}

.create-btn:hover {
  background: #2e9549;
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 6px 12px rgba(52, 168, 83, 0.3);
}

.refresh-btn {
  padding: 0.7rem 1.2rem;
  background: #1a73e8;
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  box-shadow: 0 4px 10px rgba(26, 115, 232, 0.2);
}

.refresh-btn:hover {
  background: #1967d2;
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 6px 12px rgba(26, 115, 232, 0.3);
}

@media (max-width: 768px) {
  .stream-page {
    padding: 1rem;
    height: calc(100vh - 80px);
  }
  
  .stream-container {
    gap: 1.5rem;
  }
  
  .stream-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .stream-status {
    align-self: flex-start;
  }
  
  .stream-info {
    padding: 1.5rem;
  }
  
  .info-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .label {
    margin-bottom: 0.5rem;
  }
  
  .value {
    width: 100%;
  }
  
  .join-form {
    flex-direction: column;
    align-items: stretch;
  }
  
  .join-input {
    width: 100%;
  }
}
</style>
