import api from '@/services/api'
import { useNotifyStore } from '@/stores/notify'
import { defineStore } from 'pinia'

export const useParticipantsStore = defineStore('participants', {
  state: () => ({
    items: [],
    loading: false,
  }),

  actions: {
    // =====================
    // GET PARTICIPANTS BY GROUP
    // =====================
    async fetch(group_id) {
      try {
        this.loading = true
        const res = await api.get('/participants', {
          params: { group_id },
        })
        this.items = res.data.data
      } catch (err) {
        useNotifyStore().notify('Gagal memuat participants', 'error')
      } finally {
        this.loading = false
      }
    },

    // =====================
    // CREATE PARTICIPANT
    // =====================
    async create(payload) {
      try {
        await api.post('/participants', payload)
        useNotifyStore().notify('Participant berhasil ditambahkan ✅', 'success')
      } catch (err) {
        useNotifyStore().notify(
          err.response?.data?.message || 'Gagal menambahkan participant',
          'error'
        )
        throw err
      }
    },

    // =====================
    // UPDATE PARTICIPANT (status)
    // =====================
    async update(id, payload) {
      try {
        await api.put(`/participants/${id}`, payload)
        useNotifyStore().notify('Participant berhasil diupdate ✅', 'success')
      } catch (err) {
        useNotifyStore().notify('Gagal update participant', 'error')
        throw err
      }
    },

    // =====================
    // DELETE PARTICIPANT
    // =====================
    async remove(id) {
      try {
        await api.delete(`/participants/${id}`)
        useNotifyStore().notify('Participant berhasil dihapus ✅', 'success')
      } catch (err) {
        useNotifyStore().notify('Gagal hapus participant', 'error')
        throw err
      }
    },
  },
})
