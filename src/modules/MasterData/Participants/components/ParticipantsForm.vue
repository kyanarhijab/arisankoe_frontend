<template>
  <VForm ref="formRef" class="pa-4" lazy-validation>
    <!-- 🔍 BARIS SEARCH -->
    <div class="search-wrapper">
      <VTextField
        v-model="search"
        placeholder="Cari..."
        density="compact"
        variant="outlined"
        hide-details
        class="search-field"
      />
    </div>

    <!-- TABLE -->
    <VDataTable
      :headers="[
      { title: 'Nama', key: 'name' },
      { title: 'Email', key: 'email' }
    ]"
    :items="store.items"
    density="compact"
    />
  </VForm>
</template>

<script setup>
import { useUserStore } from '@/modules/MasterData/User/stores/User'
import { onMounted, ref, watch } from 'vue'

const store = useUserStore()
const search = ref('')

// auto search ketika mengetik
watch(search, (val) => {
  store.fetch(val)
})

// load awal
onMounted(() => store.fetch())
</script>

<style scoped>
.search-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 8px; /* jarak bawah biar rapat */
}

.search-field {
  max-width: 220px; /* biar kecil aja */
}

:deep(.v-table > .v-table__wrapper > table > thead > tr > th) {
  background-color: #a169ff !important;
  color: white !important;
  font-weight: 600 !important;
}
</style>
