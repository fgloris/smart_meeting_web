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
    user: null as { useremail: string; username: string; password: string; uid: number } | null,
    isAuthenticated: false,
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
          uid: response.user.uid,
        }
        this.isAuthenticated = true
        return true
      } catch (error) {
        console.error('Login error:', error)
        return false
      }
    },

    async verify() {
      try {
        const response = await verify(this.tempUserEmail)
        console.info('Verify response:', response)
        return true
      } catch (error) {
        console.error('Verify error:', error)
        return false
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
          uid: response.user.uid,
        }
        this.isAuthenticated = true
        return true
      } catch (error) {
        console.error('Register error:', error)
        return false
      }
    },

    logout() {
      console.info('Logout')
      this.user = null
      this.isAuthenticated = false
    },
  },
})
