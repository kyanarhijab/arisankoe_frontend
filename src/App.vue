<script setup>
import { useNotifyStore } from '@/stores/notify';
const notify = useNotifyStore()
</script>
<template>
  <RouterView />

  <!-- Snackbar global -->
  <VSnackbar
    v-model="notify.show"
    :color="notify.color"
    location="top end"
    timeout="3000"
  >
    {{ notify.message }}
  </VSnackbar>
</template>


