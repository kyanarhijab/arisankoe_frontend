import axios from '@/services/api'
import { useNotifyStore } from '@/stores/notify'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    items: [],
  }),
  actions: {
    async fetch() {
      const res = await axios.get('user.php')
      this.items = res.data
    },
    async create(data) {
      try {
        await axios.post('user.php', data)
        useNotifyStore().notify('Action completed successfully ✅','success')
        this.fetch()
      } catch (err) {
        useNotifyStore().notify('Gagal menambahkan user', 'error')
      }
    },
    async update(data) {


      try {
        await axios.put(`user.php?user=${data.username}`, data)
        useNotifyStore().notify('Action completed successfully ✅','success')
        this.fetch()
      } catch (err) {
        useNotifyStore().notify('Gagal update user', 'error')
      }

     
    },
    async remove(username) {

      try {
        await axios.delete(`user.php?user=${username}`)
        useNotifyStore().notify('Action completed successfully ✅','success')
        this.fetch()
      } catch (err) {
        useNotifyStore().notify('Gagal hapus user', 'error')
      }

     
    },
  },
})
