import api from '@/services/api'
import { useNotifyStore } from '@/stores/notify'
import { saveAs } from 'file-saver'
import { defineStore } from 'pinia'
import * as XLSX from 'xlsx'

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
        useNotifyStore().notify(err.response?.data?.message || 'Gagal menambahkan Group Arisan', 'error')
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
       
    async exportExcelFile(group_id) {
      try {
      const res = await api.get('/groups_export', {
        params: { group_id }
      })

      const rawData = res.data.data

      if (!rawData.length) {
        useNotifyStore().notify('Data kosong', 'error')
        return
      }

      // 🔥 ambil semua key (buat header dinamis)
      const keys = Object.keys(rawData[0])

      // 🔥 urutkan: nama dulu, baru 1..n
      const headers = [
        'nama',
        ...keys.filter(k => k !== 'nama').sort((a, b) => Number(a) - Number(b))
      ]

      // 🔥 mapping sesuai urutan header
      const data = rawData.map(row => {
        const newRow = {}
        headers.forEach(h => {
          newRow[h] = row[h]
        })
        return newRow
      })

      // 🔥 convert ke excel
      const worksheet = XLSX.utils.json_to_sheet(data)
      const workbook = XLSX.utils.book_new()

      XLSX.utils.book_append_sheet(workbook, worksheet, 'Arisan')

      const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      })

      const file = new Blob([excelBuffer], {
        type: 'application/octet-stream',
      })

      saveAs(file, `arisan-${group_id}.xlsx`)

      useNotifyStore().notify('Export berhasil ✅', 'success')

    } catch (err) {
      console.error(err)
      useNotifyStore().notify('Gagal export', 'error')
    }
  },

  },

  
  
})
