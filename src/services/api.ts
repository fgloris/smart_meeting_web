import axios from 'axios'

const BASE_URL = 'http://1.92.146.109:5000'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
})

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

export default api
