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

export const getMeetings = async () => {
  const response = await api.get('/api/meeting')
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

export default api
