<script setup>

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <li
    class="nav-link"
    :class="{ disabled: item.disabled }"
  >
    <!-- Gunakan 'RouterLink' langsung, bukan sebagai ekspresi -->
    <component
      :is="item.path ? 'RouterLink' : 'a'"
      :to="item.path || undefined"
      :href="!item.path ? item.href || '#' : undefined"
      :target="item.target"
    >
      <VIcon
        :icon="item.icon || 'ri-checkbox-blank-circle-line'"
        class="nav-item-icon"
      />
      <span class="nav-item-title">
        {{ item.title }}
      </span>

      <span
        v-if="item.badgeContent"
        class="nav-item-badge"
        :class="item.badgeClass"
      >
        {{ item.badgeContent }}
      </span>
    </component>
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
