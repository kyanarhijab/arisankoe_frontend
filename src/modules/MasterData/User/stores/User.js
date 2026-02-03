import api from '@/services/api'
import { useNotifyStore } from '@/stores/notify'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    items: [],
    loading: false,
  }),

  actions: {
    // =====================
    // GET USERS
    // =====================
    async fetch() {
      try {
        this.loading = true
        const res = await api.get('/users')
        this.items = res.data.data
      } catch (err) {
        useNotifyStore().notify('Gagal memuat user', 'error')
      } finally {
        this.loading = false
      }
    },

    // =====================
    // CREATE USER
    // =====================
    async create(payload) {
      try {
        await api.post('/users', payload)
        useNotifyStore().notify('User berhasil ditambahkan ✅', 'success')
        this.fetch()
      } catch (err) {
        useNotifyStore().notify(
          err.response?.data?.message || 'Gagal menambahkan user',
          'error'
        )
      }
    },

    // =====================
    // UPDATE USER
    // =====================
    async update(id, payload) {
      try {
        await api.put(`/users/${id}`, payload)
        useNotifyStore().notify('User berhasil diupdate ✅', 'success')
        this.fetch()
      } catch (err) {
        useNotifyStore().notify('Gagal update user', 'error')
      }
    },

    // =====================
    // DELETE USER
    // =====================
    async remove(id) {
      try {
        await api.delete(`/users/${id}`)
        useNotifyStore().notify('User berhasil dihapus ✅', 'success')
        this.fetch()
      } catch (err) {
        useNotifyStore().notify('Gagal hapus user', 'error')
      }
    },
  },
})
