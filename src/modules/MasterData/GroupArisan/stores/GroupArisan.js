import api from '@/services/api'
import { useNotifyStore } from '@/stores/notify'
import { defineStore } from 'pinia'

export const useGroupArisanStore = defineStore('groupArisan', {
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
        const res = await api.get('/groups')
        this.items = res.data.data
      } catch (err) {
        useNotifyStore().notify('Terjadi kesalahan saat memuat data pengguna.', 'error')
      } finally {
        this.loading = false
      }
    },

    // =====================
    // CREATE USER
    // =====================
    async create(payload) {
      try {
        await api.post('/groups', payload)
        useNotifyStore().notify('Data grup arisan telah berhasil ditambahkan.', 'success')
        this.fetch()
      } catch (err) {
        useNotifyStore().notify(
          err.response?.data?.message || 'Gagal menambahkan Group Arisan',
          'error'
        )
      }
    },

    // =====================
    // UPDATE USER
    // =====================
    async update(payload) {
      try {
        await api.put(`/groups/${payload.id}`, payload)
        useNotifyStore().notify('Data grup arisan telah berhasil diupdate.', 'success')
        this.fetch()
      } catch (err) {
        useNotifyStore().notify('Gagal update Group Arisan', 'error')
      }
    },

    

    // =====================
    // DELETE USER
    // =====================
    async remove(id) {
      try {
        await api.delete(`/groups/${id}`)
        useNotifyStore().notify('Data grup arisan telah berhasil dihapus.', 'success')
        this.fetch()
      } catch (err) {
        useNotifyStore().notify('Gagal hapus Group Arisan', 'error')
      }
    },
  },
})
