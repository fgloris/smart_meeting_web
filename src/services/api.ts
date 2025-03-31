import axios from 'axios'

const BASE_URL = 'http://1.92.146.109:5000'

const api = axios.create({
  baseURL: BASE_URL,
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
  avatar: string
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
  friend_email: string
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

export default api
