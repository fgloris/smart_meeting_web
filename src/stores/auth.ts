import { defineStore } from 'pinia';
import { login } from '@/services/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    tempUserEmail: '',
    tempUserPasswd: '',
    user: null as { useremail: string, username: string, password: string } | null,
    isAuthenticated: false,
  }),
  
  actions: {
    async login(useremail: string, password: string) {
      try {
        const data = await login(useremail, password);
        console.info('Login success:', data);
        console.info('Login success:', data.user.username);
        this.user = { useremail: useremail, username: data.user.username, password: password };
        this.isAuthenticated = true;
        return true;
      } catch (error) {
        console.error('Login failed:', error);
        return false;
      }
    },
    
    logout() {
      this.user = null;
      this.isAuthenticated = false;
    }
  }
});
