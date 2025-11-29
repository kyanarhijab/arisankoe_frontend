// src/modules/GroupArisan/index.js
export default [
  {
    path: '/MasterData/GroupArisan',
    name: 'GroupArisan',
    component: () => import('@/modules/MasterData/GroupArisan/pages/GroupArisan.vue'),
    meta: { title: 'Group Arisan', requiresAuth: true },
  },
]
