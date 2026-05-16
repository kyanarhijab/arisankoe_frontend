import api from '@/services/api'
import { useNotifyStore } from '@/stores/notify'
import { defineStore } from 'pinia'

export const usePutaranArisanStore = defineStore('putaranArisan', {
  state: () => ({
    items: [],
    itemsModal: [] ,
    itemsHistori: [] ,
    loading: false,
    //loadingHistori: false,
    loading_save: false,
    loading_fetch:false,
    loading_save_payment:false,
    loading_pemenang_arisan:false
  }),

  actions: {
    // =====================
    // GET putaranArisan BY GROUP
    // =====================
    async fetch(group_id,putaran) {
      try {
        this.loading = true
        const res = await api.get('/rounds', {
          params: { group_id , putaran },
        })
        this.items = res.data.data
      } catch (err) {
        useNotifyStore().notify('Gagal memuat putaranArisan', 'error')
      } finally {
        this.loading = false
      }
    },


     async fetch_arisan() {
      try {
        this.loading_fetch = true
        const res = await api.get('/rounds_fetch_arisan', {
        })
        this.itemsModal = res.data.data
      } catch (err) {
        useNotifyStore().notify('Gagal memuat putaranArisan', 'error')
      } finally {
        this.loading = false
      }
    },

    async histori_arisan() {
      try {
        //this.loading = true
        const res = await api.get('/round_histori_arisan', {
        })
        this.itemHistori = res.data.data
      } catch (err) {
        useNotifyStore().notify('Gagal memuat  histori putaranArisan', 'error')
      } finally {
        //this.loading = false
      }
    },


    async savePutaran(payload) {
      try {
        this.loading_save = true

        const res = await api.post('/rounds', payload)

        if (!res.data.success) {
          throw new Error(res.data.message || 'Gagal simpan')
        }

        useNotifyStore().notify('Putaran berhasil ditambahkan ✅', 'success')

        return res.data

      } catch (err) {
        useNotifyStore().notify(err.message || 'Terjadi error', 'error')
        throw err
      } finally {
        this.loading_save = false
      }
    },


    async savePayment(payload) {
      try {
        this.loading_save_payment = true

        const res = await api.post('/rounds_payment', payload)

        if (!res.data.success) {
          throw new Error(res.data.message || 'Gagal simpan')
        }

        useNotifyStore().notify('Pembayaran berhasil ditambahkan ✅', 'success')

        return res.data

      } catch (err) {
        useNotifyStore().notify(err.message || 'Terjadi error', 'error')
        throw err
      } finally {
        this.loading_save = false
      }
    },

    async pemenangArisan(payload) {
      try {
        this.loading_pemenang_arisan = true

        const res = await api.post('/rounds_winner', payload)

        if (!res.data.success) {
          throw new Error(res.data.message || 'Gagal simpan')
        }

        useNotifyStore().notify('Pemenang berhasil ditambahkan ✅', 'success')

        return res.data

      } catch (err) {
        useNotifyStore().notify(err.message || 'Terjadi error', 'error')
        throw err
      } finally {
        this.loading_save = false
      }
    },

  },
})
