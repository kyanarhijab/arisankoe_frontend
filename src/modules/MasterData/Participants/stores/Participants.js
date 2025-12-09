import axios from '@/services/api'
import { useNotifyStore } from '@/stores/notify'
import { defineStore } from 'pinia'

export const useParticipantsStore = defineStore('participants', {
  state: () => ({
    items: [],
  }),
  actions: {
    async fetch(kode = '') {
      const res = await axios.get('participants.php', {
        params: { kode: kode },
      })
      this.items = res.data
    },
    async create(data) {
      try {
        await axios.post('participants.php', data)
        useNotifyStore().notify('Action completed successfully ✅', 'success')
        this.fetch()
      } catch (err) {
        useNotifyStore().notify('Gagal menambahkan participants', 'error')
      }
    },
    async update(data) {
      try {
        await axios.put(`participants.php?id=${data.id}`, data)
        useNotifyStore().notify('Action completed successfully ✅', 'success')
        this.fetch()
      } catch (err) {
        useNotifyStore().notify('Gagal update participants', 'error')
      }
    },
    async remove(id) {
      try {
        await axios.delete(`participants.php?id=${id}`)
        useNotifyStore().notify('Action completed successfully ✅', 'success')
        this.fetch()
      } catch (err) {
        useNotifyStore().notify('Gagal hapus participants', 'error')
      }
    },
  },
})
