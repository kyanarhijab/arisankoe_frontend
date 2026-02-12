import api from '@/services/api'
import { useNotifyStore } from '@/stores/notify'
import { defineStore } from 'pinia'

export const usePutaranArisanStore = defineStore('putaranArisan', {
  state: () => ({
    items: [],
    loading: false,
  }),

  actions: {
    // =====================
    // GET putaranArisan BY GROUP
    // =====================
    async fetch(group_id) {
      try {
        this.loading = true
        const res = await api.get('/putaranArisan', {
          params: { group_id },
        })
        this.items = res.data.data
      } catch (err) {
        useNotifyStore().notify('Gagal memuat putaranArisan', 'error')
      } finally {
        this.loading = false
      }
    },

    // =====================
    // CREATE putaranArisan
    // =====================
    async create(payload) {
      try {
        await api.post('/putaranArisan', payload)
        useNotifyStore().notify('putaranArisan berhasil ditambahkan ✅', 'success')
      } catch (err) {
        useNotifyStore().notify(
          err.response?.data?.message || 'Gagal menambahkan putaranArisan',
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
        await api.put(`/putaranArisan/${id}`, payload)
        useNotifyStore().notify('putaranArisan berhasil diupdate ✅', 'success')
      } catch (err) {
        useNotifyStore().notify('Gagal update putaranArisan', 'error')
        throw err
      }
    },

    // =====================
    // DELETE PARTICIPANT
    // =====================
    async remove(id) {
      try {
        await api.delete(`/putaranArisan/${id}`)
        useNotifyStore().notify('putaranArisan berhasil dihapus ✅', 'success')
      } catch (err) {
        useNotifyStore().notify('Gagal hapus putaranArisan', 'error')
        throw err
      }
    },
  },
})
