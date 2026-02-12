// src/modules/Arisan/index.js
export default [
  {
    path: '/Transaksi/PutaranArisan',
    name: 'PutaranArisan',
    component: () => import('@/modules/Transaksi/PutaranArisan/pages/PutaranArisan.vue'),
    meta: { title: 'PutaranArisan', requiresAuth: true },
  },
]
