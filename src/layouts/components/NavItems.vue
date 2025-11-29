<script setup>
import VerticalNavGroup from '@layouts/components/VerticalNavGroup.vue';
import VerticalNavLink from '@layouts/components/VerticalNavLink.vue';

import { useMenuStore } from '@/stores/menu';

const menuStore = useMenuStore()

// onMounted(() => {
//   menuStore.fetchMenus()
// })

const hasChildren = item => !!item.children && Array.isArray(item.children) && item.children.length > 0
</script>

<template>
  <div v-if="menuStore.menus.length"> 
    <template v-for="item in menuStore.menus" :key="item.kode_menu">
      <VerticalNavGroup
        v-if="hasChildren(item)"
        :item="item"
        :title="item.title"
        :icon="item.icon"
      >
        <VerticalNavLink
          v-for="child in item.children"
          :key="child.kode_menu"
          :item="child"
        />
      </VerticalNavGroup>

      <VerticalNavLink
        v-else
        :item="item"
      />
    </template>
  </div>
</template>
