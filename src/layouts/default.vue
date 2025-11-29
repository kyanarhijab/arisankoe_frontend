<script setup>
import { useAuthStore } from '@/stores/auth'
import { useMenuStore } from '@/stores/menu'
import { onMounted } from 'vue'
import DefaultLayoutWithVerticalNav from './components/DefaultLayoutWithVerticalNav.vue'

const authStore = useAuthStore()
const menuStore = useMenuStore()

onMounted(async () => {
  console.log('=== Default Layout Mounted ===')
  console.log('Auth Token:', authStore.token)
  console.log('Is Authenticated:', authStore.isAuthenticated)
  console.log('Menu length awal:', menuStore.menus.length)

  if (authStore.isAuthenticated && menuStore.menus.length === 0) {
    console.log('➡️ Memuat menu...')
    await menuStore.fetchMenus()
    console.log('Menu setelah fetch:', menuStore.menus)
  }
})
</script>

<template>
  <DefaultLayoutWithVerticalNav>
    <RouterView />
  </DefaultLayoutWithVerticalNav>
</template>

<style lang="scss">
// As we are using `layouts` plugin we need its styles to be imported
@use "@layouts/styles/default-layout";
</style>
