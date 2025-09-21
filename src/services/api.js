// src/services/api.js
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost/arisankoe-backend/auth/Login.php/', // ganti sesuai backend kamu
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api
