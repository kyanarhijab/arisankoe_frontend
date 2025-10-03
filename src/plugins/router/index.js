import { useAuthStore } from '@/stores/auth'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

// 🔥 Update title setiap route berubah
router.afterEach((to) => {
  const appName = 'ArisanKita'

  // Cari title dari child route yang paling dalam
  const nearestWithTitle = [...to.matched].reverse().find(r => r.meta && r.meta.title)

  if (nearestWithTitle) {
    document.title = `${nearestWithTitle.meta.title} | ${appName}`
  } else {
    document.title = appName
  }
})

// 👉 Bisa dipakai sebagai plugin di main.js
export default function install(app) {
  app.use(router)
}

export { router }
