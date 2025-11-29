// src/services/api.js
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost/arisankoe-backend/', // ganti sesuai backend kamu
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
})

// Interceptor untuk tangani error global
api.interceptors.response.use(
  response => response,
  error => {
    let msg = 'Terjadi kesalahan, coba lagi.'
    if (error.response) {
      // error dari server (status code 4xx / 5xx)
      msg = error.response.data?.message || `Error ${error.response.status}`
    } else if (error.request) {
      // tidak ada respon dari server
      msg = 'Server tidak merespon, cek koneksi.'
    } else {
      msg = error.message
    }

    // Trigger global event (pakai window)
    window.dispatchEvent(new CustomEvent('api-error', { detail: msg }))
    
    return Promise.reject(error)
  }
)

// Tambahkan token otomatis ke semua request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})


export default api
