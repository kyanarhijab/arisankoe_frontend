<script setup>

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <li class="nav-link" :class="{ disabled: item.disabled }">

  <!-- NEW TAB -->
  <a
    v-if="item.newTab"
    :href="item.path"
    target="_blank"
    rel="noopener noreferrer"
  >
    <VIcon
      :icon="item.icon || 'ri-checkbox-blank-circle-line'"
      class="nav-item-icon"
    />
    <span class="nav-item-title">{{ item.title }}</span>
  </a>

  <!-- NORMAL ROUTE -->
  <RouterLink
    v-else-if="item.path"
    :to="item.path"
  >
    <VIcon
      :icon="item.icon || 'ri-checkbox-blank-circle-line'"
      class="nav-item-icon"
    />
    <span class="nav-item-title">{{ item.title }}</span>
  </RouterLink>

  <!-- FALLBACK -->
  <a v-else :href="item.href || '#'">
    <VIcon
      :icon="item.icon || 'ri-checkbox-blank-circle-line'"
      class="nav-item-icon"
    />
    <span class="nav-item-title">{{ item.title }}</span>
  </a>

</li>
</template>

<style lang="scss">
.layout-vertical-nav {
  .nav-link {
    a,
    .router-link {
      display: flex;
      align-items: center;
      cursor: pointer;
      text-decoration: none;
    }

    &.disabled {
      opacity: 0.5;
      pointer-events: none;
      cursor: not-allowed;
    }
  }
}
</style>
