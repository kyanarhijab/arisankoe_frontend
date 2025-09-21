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
    menus: []
  }),
  actions: {
    async fetchMenus() {
      const res = await axios.get('http://localhost/arisankoe-backend/menu.php', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })

      // Tidak perlu buildTree, langsung pakai res.data
      this.menus = ensureChildren(Array.isArray(res.data) ? res.data : [])

      // Pastikan semua item punya children (default [])
        this.menus.forEach(menu => {
            if (!Array.isArray(menu.children)) {
            menu.children = []
            }
        })

      console.log('Final Menus:', this.menus)
    }
  }
})

