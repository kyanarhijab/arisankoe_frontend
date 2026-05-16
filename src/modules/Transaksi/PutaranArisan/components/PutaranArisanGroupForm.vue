<template>
  <VForm
    ref="groupFormRef"
    class="pa-4"
    lazy-validation
  >
    <!-- 🔍 Baris Search -->
    <div class="search-wrapper">
      <VTextField
        v-model="search"
        placeholder="Cari..."
        prepend-inner-icon="ri-search-2-line"
        variant="solo-filled"
        density="compact"
        hide-details
        style="max-width: 220px"
      />
    </div>

    <!-- TABLE -->
    <VDataTable
      :headers="[
        { title: 'Kode', key: 'kode' },
        { title: 'Nama', key: 'nama' },
        { title: 'Keterangan', key: 'keterangan' },
        { title: 'Aksi', key: 'actions', sortable: false },
      ]"
       :items="store.itemsModal"
      :search="search"
      density="compact"
    >
      <!-- SLOT ACTION -->
      <template #item.actions="{ item }">
        <div class="action-wrapper">
          <VBtn
            size="x-small"
            color="primary"
            @click="pilihRow(item)"
          >
            <VIcon
              icon="ri-add-line"
              class="mr-1"
            />
            Pilih Data
          </VBtn>
        </div>
      </template>
    </VDataTable>
  </VForm>
</template>

<script setup>
import { usePutaranArisanStore } from '@/modules/Transaksi/PutaranArisan/stores/PutaranArisan'
import debounce from 'lodash/debounce'
import { ref } from 'vue'

const store = usePutaranArisanStore()
const search = ref('')

const emit = defineEmits(['Choose'])


// FETCH otomatis saat mengetik
watch(
  search,
  debounce((val) => {
    store.fetch_arisan(val)
  }, 800)
)

// LOAD awal
onMounted(() => store.fetch_arisan())

function pilihRow(item) {
  emit('Choose', item) // kirim data ke parent
}
</script>

<style scoped>
.search-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 8px;
}

:deep(.v-table > .v-table__wrapper > table > thead > tr > th) {
  background-color: #a169ff !important;
  color: white !important;
  font-weight: 600 !important;
}

:deep(.v-btn) {
  font-size: 11px;
  font-weight: 600;
}
</style>
