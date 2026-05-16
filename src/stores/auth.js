import api from '@/services/api'
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
    async init() {
    if (this.initialized) return

    const token = localStorage.getItem('token')
    if (token) {
      this.token = token

      try {
       const res = await api.get('/me')
        this.user = res.data
      } catch (e) {
        this.logout()
      }
    }

    this.initialized = true
  },
    async login(username, password) {
      try {
        const res = await api.post('/login', { username, password })

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
