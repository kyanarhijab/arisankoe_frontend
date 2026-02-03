import axios from '@/services/api'
import { defineStore } from 'pinia'

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

        const res = await axios.get('http://localhost/arisankoe-backend/public/api/menus', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        // 🔥 AMBIL DATA YANG BENAR
        const flatMenus = res.data.data || []

        // 🔥 BUILD TREE
        this.menus = this.buildTree(flatMenus)

        console.log('✅ Final Menus Tree:', this.menus)
      } catch (err) {
        console.error('❌ Gagal memuat menu:', err)
      } finally {
        this.loading = false
      }
    },

    buildTree(items) {
      const map = {}
      const tree = []

      // init map
      items.forEach(item => {
        map[item.id] = { ...item, children: [] }
      })

      // build parent-child
      items.forEach(item => {
        if (item.parent_id) {
          map[item.parent_id]?.children.push(map[item.id])
        } else {
          tree.push(map[item.id])
        }
      })

      return tree
    },

    clearMenus() {
      this.menus = []
    },
  },
})
