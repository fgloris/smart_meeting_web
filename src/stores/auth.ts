import { defineStore } from 'pinia'
import { login, verify, register } from '@/services/api'

interface AuthError {
  message: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    tempUserEmail: '',
    tempUserPasswd: '',
    tempUserName: '',
    tempUserVerifyCode: '',
    user: null as { useremail: string; username: string; password: string } | null,
    isAuthenticated: false,
    error: null as AuthError | null,
  }),

  actions: {
    async login() {
      try {
        const response = await login(this.tempUserEmail, this.tempUserPasswd)
        console.info('Login response:', response)
        this.user = {
          useremail: response.user.useremail,
          username: response.user.username,
          password: response.user.userpassword,
        }
        this.isAuthenticated = true
        this.error = null
        return { success: true }
      } catch (error) {
        console.error('Login error:', error)
        this.error = { message: '登录失败，请检查邮箱地址或密码' }
        return { success: false, error: this.error }
      }
    },

    async verify() {
      try {
        const response = await verify(this.tempUserEmail)
        console.info('Verify response:', response)
        this.error = null
        return { success: true }
      } catch (error) {
        console.error('Verify error:', error)
        this.error = { message: '验证码发送失败，请稍后重试' }
        return { success: false, error: this.error }
      }
    },

    async register() {
      try {
        const response = await register(
          this.tempUserName,
          this.tempUserPasswd,
          this.tempUserEmail,
          this.tempUserVerifyCode,
        )
        console.info('Register response:', response)
        this.user = {
          useremail: this.tempUserEmail,
          username: this.tempUserName,
          password: this.tempUserPasswd,
        }
        this.isAuthenticated = true
        this.error = null
        return { success: true }
      } catch (error) {
        console.error('Register error:', error)
        this.error = { message: '注册失败，请检查验证码并稍后重试' }
        return { success: false, error: this.error }
      }
    },

    logout() {
      console.info('Logout')
      this.user = null
      this.isAuthenticated = false
      this.error = null
    },
  },
})
