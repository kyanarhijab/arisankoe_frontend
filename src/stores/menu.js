import axios from '@/services/api'
import { defineStore } from 'pinia'

function ensureChildren(menuList) {
  return menuList.map(menu => {
    if (!Array.isArray(menu.children)) {
      menu.children = []
    } else {
      menu.children = ensureChildren(menu.children)
    }
    return menu
  })
}

export const useMenuStore = defineStore('menu', {
  state: () => ({
    menus: [],
    loading: false,
  }),
  actions: {
    async fetchMenus() {
      if (this.loading) return
      this.loading = true
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          console.warn('Tidak ada token, tidak memuat menu')
          return
        }

        const res = await axios.get('http://localhost/arisankoe-backend/menu.php', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = Array.isArray(res.data) ? res.data : []
        this.menus = ensureChildren(data)
        console.log('✅ Final Menus:', this.menus)
      } catch (err) {
        console.error('❌ Gagal memuat menu:', err)
      } finally {
        this.loading = false
      }
    },
    clearMenus() {
      this.menus = []
    },
  },
})
