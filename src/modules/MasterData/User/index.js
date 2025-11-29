// src/modules/Arisan/index.js
export default [
  {
    path: '/MasterData/User',
    name: 'User',
    component: () => import('@/modules/MasterData/User/pages/User.vue'),
    meta: { title: 'User', requiresAuth: true },
  },
]
