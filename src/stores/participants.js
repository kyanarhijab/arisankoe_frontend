// src/stores/groupArisan.js
import api from '@/services/api'
import { useNotifyStore } from '@/stores/notify'
import { defineStore } from 'pinia'

export const useParticipantsStore = defineStore('participants', {
  state: () => ({
    items: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetch() {
      this.loading = true
      this.error = null
      try {
        const res = await api.get('group_arisan.php')
        this.items = res.data
      } catch (err) {
        this.error = err.response?.data?.error || err.message
        console.error('Fetch error:', this.error)
      } finally {
        this.loading = false
      }
    },

    async create(data) {
      try {
        await api.post('group_arisan.php', data)
        useNotifyStore().notify('Action completed successfully ✅','success')
        await this.fetch()
      } catch (err) {
        useNotifyStore().notify('Something went wrong !!!', 'error')
        console.error('Create error:', err.response?.data || err.message)
        throw err
      }
    },

    async update(data) {
      try {
        await api.put(`group_arisan.php?kode=${data.kode}`, data)
        useNotifyStore().notify('Action completed successfully ✅','success')
        await this.fetch()
      } catch (err) {
        useNotifyStore().notify('Something went wrong !!!', 'error')
        console.error('Update error:', err.response?.data || err.message)
        throw err
      }
    },

    async remove(id) {
      try {
        await api.delete(`group_arisan.php?kode=${id}`)
        useNotifyStore().notify('Action completed successfully ✅','success')
        await this.fetch()
      } catch (err) {
        useNotifyStore().notify('Something went wrong !!!', 'error')
        console.error('Delete error:', err.response?.data || err.message)
        throw err
      }
    },
  },
})
