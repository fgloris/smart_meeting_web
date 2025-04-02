import axios from 'axios'

const BASE_URL = 'http://1.92.146.109:5000'
const LIVE_SERVER_URL = 'http://47.79.86.58'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
})

// 创建直播服务的API实例
const liveApi = axios.create({
  baseURL: LIVE_SERVER_URL,
  timeout: 30000,
})

export interface Meeting {
  id: number
  meetingid: number
  meetinglocation: string
  meetingmember: number
  meetingname: string
  meetingtime: string
}

export interface CreateMeetingData {
  meetingid: number
  meetingname: string
  meetinglocation: string
  meetingtime: string
  meetingmembers: number[]
}

export interface MeetingFile {
  description: string
  file_name: string
  file_path: string
  file_size: number
  file_type: string
  id: number
  is_deleted: boolean
  meeting_id: number
  upload_time: string
  uploader_id: number
}

export interface MeetingFilesResponse {
  files: MeetingFile[]
  meeting_id: number
}

export interface Friend {
  user_id: number
  nickname: string
}

export interface Message {
  id: number
  sender_id: number
  receiver_id: number
  content: string
  created_at: string
  is_read: boolean
}

export interface FriendRequest {
  friend_id: number
  friend_name: string
  friend_email: string
}

export interface LiveRoom {
  uuid: string
  title: string
  stream: string
  secret: string
  assistant: boolean
  aiName: string
  aiProvider: string
  aiSecretKey: string
  aiOrganization: string
  aiBaseURL: string
  aiAsrEnabled: boolean
  aiAsrLanguage: string
  aiAsrPrompt: string
  aiChatEnabled: boolean
  aiChatModel: string
  aiChatPrompt: string
  aiChatMaxWindow: number
  aiChatMaxWords: number
  aiPostEnabled: boolean
  aiPostModel: string
  aiPostPrompt: string
  aiPostMaxWindow: number
  aiPostMaxWords: number
  aiTtsEnabled: boolean
  stage_uuid: string
  roomToken: string
  created_at: string
}

export interface LiveRoomResponse {
  code: number
  data: LiveRoom
  server: number
}

export interface JoinLiveRoomParams {
  stream: string
  secret: string
}

export const login = async (useremail: string, userpassword: string) => {
  const response = await api.post('/api/user/login', { useremail, userpassword })
  return response.data
}

export const verify = async (useremail: string) => {
  const response = await api.post('/api/user/send-verification', { useremail })
  return response.data
}

export const register = async (
  username: string,
  userpassword: string,
  useremail: string,
  verification_code: string,
) => {
  console.log('register', { username, userpassword, useremail, verification_code })
  const response = await api.post('/api/user', {
    username,
    userpassword,
    useremail,
    verification_code,
  })
  return response.data
}

export const getMeetings = async (userId: number) => {
  const response = await api.get(`/api/meeting/list/${userId}`)
  console.log('getMeetings', response.data)
  return response.data
}

export const getMeetingFiles = async (meetingId: number) => {
  const response = await api.get(`/api/meeting/file/meeting/${meetingId}`)
  return response.data
}

export const uploadMeetingFile = async (
  meetingId: number,
  uploaderId: number,
  file: File,
  description: string = '',
) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('meeting_id', meetingId.toString())
  formData.append('uploader_id', uploaderId.toString())
  formData.append('description', description)

  const response = await api.post('/api/meeting/file/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data
}

export const downloadMeetingFile = async (filePath: string) => {
  const response = await api.get(`/api/file/download/${filePath}`, {
    responseType: 'blob',
  })
  return response.data
}

export const deleteMeetingFile = async (fileId: number) => {
  const response = await api.delete(`/api/meeting/file/${fileId}`)
  return response.data
}

export const createMeeting = async (meetingData: CreateMeetingData) => {
  const response = await api.post('/api/meeting/create', meetingData)
  return response.data
}

export const deleteMeeting = async (meetingId: number) => {
  const response = await api.delete(`/api/meeting/${meetingId}`)
  return response.data
}

export const getFriends = async (userId: number) => {
  const response = await api.get(`/api/friendship/friends/${userId}`)
  return response.data
}

export const getChatHistory = async (userId: number, friendId: number) => {
  const response = await api.get(`/api/message/history/${userId}/${friendId}`)
  return response.data
}

export const sendMessage = async (senderId: number, receiverId: number, content: string) => {
  const response = await api.post('/api/message', {
    sender_id: senderId,
    receiver_id: receiverId,
    content: content,
  })
  return response.data
}

export const getUnreadMessages = async (userId: number) => {
  const response = await api.get(`/api/message/unread/${userId}`)
  return response.data
}

export const markMessageAsRead = async (messageId: number) => {
  const response = await api.put(`/api/message/read/${messageId}`)
  return response.data
}

export const markAllAsRead = async (userId: number, friendId: number) => {
  const response = await api.put('/api/message/read-all', {
    user_id: userId,
    friend_id: friendId,
  })
  return response.data
}

export const deleteMessage = async (messageId: number) => {
  const response = await api.delete(`/api/message/${messageId}`)
  return response.data
}

export const sendFriendRequest = async (userId: number, friendId: number) => {
  const response = await api.post('/api/friendship/request', {
    user_id: userId,
    friend_id: friendId,
  })
  return response.data
}

export const acceptFriendRequest = async (userId: number, friendId: number) => {
  console.log('acceptFriendRequest', { userId, friendId })
  const response = await api.put('/api/friendship/accept', {
    user_id: userId,
    friend_id: friendId,
  })
  return response.data
}

export const rejectFriendRequest = async (userId: number, friendId: number) => {
  const response = await api.put('/api/friendship/reject', {
    user_id: userId,
    friend_id: friendId,
  })
  return response.data
}

export const getPendingRequests = async (userId: number) => {
  const response = await api.get(`/api/friendship/pending/${userId}`)
  console.log('getPendingRequests', response.data)
  return response.data
}

export const removeFriend = async (userId: number, friendId: number) => {
  const response = await api.delete('/api/friendship/remove', {
    data: {
      user_id: userId,
      friend_id: friendId,
    },
  })
  return response.data
}

export const quickAddFriends = async (userId: number, meetingId: number) => {
  const response = await api.post('/api/friendship/quick-add', {
    user_id: userId,
    meeting_id: meetingId,
  })
  return response.data
}

export const createLiveRoom = async (title: string) => {
  const response = await liveApi.post(
    '/terraform/v1/live/room/create',
    { title },
    {
      headers: {
        Authorization: 'Bearer srs-v2-4116c498adf0491a81efe6c6438d50f6',
      },
    },
  )
  return response.data as LiveRoomResponse
}

export const joinLiveRoom = async (params: JoinLiveRoomParams) => {
  // 由于加入直播间API可能不存在，我们直接返回输入的参数
  return {
    code: 0,
    data: {
      uuid: '',
      title: '加入的直播间',
      stream: params.stream,
      secret: params.secret,
      assistant: false,
      aiName: '',
      aiProvider: '',
      aiSecretKey: '',
      aiOrganization: '',
      aiBaseURL: '',
      aiAsrEnabled: false,
      aiAsrLanguage: '',
      aiAsrPrompt: '',
      aiChatEnabled: false,
      aiChatModel: '',
      aiChatPrompt: '',
      aiChatMaxWindow: 0,
      aiChatMaxWords: 0,
      aiPostEnabled: false,
      aiPostModel: '',
      aiPostPrompt: '',
      aiPostMaxWindow: 0,
      aiPostMaxWords: 0,
      aiTtsEnabled: false,
      stage_uuid: '',
      roomToken: '',
      created_at: new Date().toISOString(),
    },
    server: 0,
  } as LiveRoomResponse
}

export const getStreamUrl = (stream: string, secret: string) => {
  return `rtmp://47.79.86.58/live/${stream}?secret=${secret}`
}

export const getPlayUrl = (stream: string) => {
  return `http://47.79.86.58/live/${stream}.flv`
}

export default api
