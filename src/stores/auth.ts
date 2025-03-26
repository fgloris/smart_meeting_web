import { defineStore } from 'pinia';
import { login, verify, register } from '@/services/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    tempUserEmail: '',
    tempUserPasswd: '',
    tempUserName: '',
    tempUserVerifyCode: '',
    user: null as { useremail: string, username: string, password: string } | null,
    isAuthenticated: false,
  }),
  
  actions: {
    async login() {
      try {
        const data = await login(this.tempUserEmail, this.tempUserPasswd);
        console.info('Login success:', data);
        this.user = { useremail: data.user.useremail, username: data.user.username, password: data.user.userpassword };
        this.isAuthenticated = true;
        return true;
      } catch (error) {
        console.error('Login failed:', error);
        return false;
      }
    },

    async verify(){
      try {
        const data = await verify(this.tempUserEmail, this.tempUserName);
        console.info('Send verification success:', data);
        //this.user = { useremail: data.user.useremail, username: data.user.username, password: data.user.userpassword };
        //this.isAuthenticated = true;
        return true;
      } catch (error) {
        console.error('Send verification failed:', error);
        return false;
      }
    },
    
    async register() {
      try {
        const data = await register(
          this.tempUserName,
          this.tempUserPasswd,
          this.tempUserEmail,
          this.tempUserVerifyCode
        );
        console.info('Register success:', data);
        this.user = { 
          useremail: this.tempUserEmail, 
          username: this.tempUserName, 
          password: this.tempUserPasswd 
        };
        this.isAuthenticated = true;
        return true;
      } catch (error) {
        console.error('Register failed:', error);
        return false;
      }
    },

    logout() {
      this.user = null;
      this.isAuthenticated = false;
    }
  }
});
