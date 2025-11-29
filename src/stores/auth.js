import axios from 'axios'
import { defineStore } from 'pinia'
import { useMenuStore } from './menu'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || '',
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    async login(username, password) {
      try {
        const res = await axios.post(
          'http://localhost/arisankoe-backend/auth/Login.php',
          { username, password }
        )

        this.token = res.data.token
        this.user = res.data.user

        localStorage.setItem('token', this.token)
        localStorage.setItem('user', JSON.stringify(res.data.user))

        // ⬇️ Setelah login, load menu
        const menuStore = useMenuStore()
        await menuStore.fetchMenus()

      } catch (error) {
        console.error('Login error:', error.response?.data || error.message)
        throw error
      }
    },

    logout() {
      this.user = null
      this.token = ''
      localStorage.removeItem('token')
      localStorage.removeItem('user')

      const menuStore = useMenuStore()
      menuStore.clearMenus()
    },
  },
})
