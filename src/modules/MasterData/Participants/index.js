// src/modules/Arisan/index.js
export default [
    {
      path: '/MasterData/Participants',
      name: 'Participants',
      component: () => import('@/modules/MasterData/Participants/pages/Participants.vue'),
      meta: { title: 'Participants', requiresAuth: true },
    },
  ]
  