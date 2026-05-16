<script setup>
import { useGroupArisanStore } from '@/modules/MasterData/GroupArisan/stores/GroupArisan'
import { formatRupiah } from '@/utils/formatRupiah'
import { nextTick, onMounted, ref } from 'vue'


//components
import BaseModalForm from '@/components/BaseModalForm.vue'
import GroupArisanForm from '@/modules/MasterData/GroupArisan/components/GroupArisanForm.vue'


const store = useGroupArisanStore()

// State
const search = ref('')
const showModal = ref(false)
const isEdit = ref(false)
const formRef = ref(null)

const initialForm = {
  kode: null,
  name: '',
  description: '',
  total_rounds: '',
  amount: '',
  start_date: '',
  status: '',
}

const form = ref({ ...initialForm })

const headers = [
  { title: 'Kode', key: 'kode' },
  { title: 'Nama', key: 'name' },
  { title: 'Keterangan', key: 'description' },
  { title: 'Total Putaran', key: 'total_rounds' },
  { title: 'Nilai', key: 'amount' },
  { title: 'Tanggal Mulai', key: 'start_date' },
  { title: 'Status', key: 'status' },
  { title: 'Aksi', key: 'actions', sortable: false },
]

// Methods

const openAdd = () => {
  isEdit.value = false
  Object.assign(form.value, initialForm)
  showModal.value = true

  nextTick(() => {
    formRef.value?.resetValidation?.()
  })
}

const openEdit = (item) => {
  isEdit.value = true
  Object.assign(form.value, item)
  showModal.value = true

  nextTick(() => {
    formRef.value?.resetValidation?.()
  })
}

const save = async () => {
  if (!formRef.value) return

  const { valid } = await formRef.value.validate()
  if (!valid) return

  try {
    if (isEdit.value) {
      await store.update(form.value)
    } else {
      await store.create(form.value)
    }

    showModal.value = false
    await store.fetch()
  } catch (err) {
    console.error('Error saving data:', err)
  }
}

const del = async (id) => {
  if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
    try {
      await store.remove(id)
      await store.fetch()
    } catch (err) {
      console.error('Error deleting data:', err)
    }
  }
}

onMounted(() => {
  store.fetch()
})


async function cetak(id) {
  await store.exportExcelFile(id)
}


</script>

<template>
  <VCard>
    <VCardTitle class="d-flex justify-space-between align-center">
      <span>Master Group Arisan</span>
      <div class="d-flex align-center gap-2">
        <VTextField v-model="search" placeholder="Search..." prepend-inner-icon="ri-search-2-line" variant="solo-filled"
          density="compact" hide-details style="max-width: 220px" />
        <VBtn color="primary" @click="openAdd">+ Tambah Data</VBtn>
      </div>
    </VCardTitle>

    <VDataTable :headers="headers" :items="store.items" :search="search" class="elevation-1" density="comfortable">
      <template #item.amount="{ item }">
        {{ formatRupiah(item.amount) }}
      </template>

      <template #item.actions="{ item }">
        <VBtn size="small" color="primary" variant="outlined" class="me-2" @click="openEdit(item)">Edit</VBtn>
        <VBtn size="small" color="error" variant="outlined" class="me-2" @click="del(item.id)">Hapus</VBtn>
        <VBtn size="small" color="info" variant="outlined" @click="cetak(item.kode)">Cetak</VBtn>
      </template>
    </VDataTable>

    <BaseModalForm v-model="showModal" :title="isEdit ? 'Edit Group' : 'Tambah Group'" @save="save">
      <GroupArisanForm :key="isEdit ? 'edit' : 'add'" v-model="form" :isEdit="isEdit" ref="formRef" />
    </BaseModalForm>
  </VCard>
</template>
