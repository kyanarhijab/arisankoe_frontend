import axios from '@/services/api'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    items: [],
  }),
  actions: {
    async fetch() {
      const res = await axios.get('http://localhost/arisankoe-backend/user.php')
      this.items = res.data
    },
    async create(data) {
      await axios.post('http://localhost/arisankoe-backend/user.php', data)
      this.fetch()
    },
    async update(data) {
      await axios.put(`http://localhost/arisankoe-backend/user.php?id=${data.id}`, data)
      this.fetch()
    },
    async remove(id) {
      await axios.delete(`http://localhost/arisankoe-backend/user.php?id=${id}`)
      this.fetch()
    },
  },
})
