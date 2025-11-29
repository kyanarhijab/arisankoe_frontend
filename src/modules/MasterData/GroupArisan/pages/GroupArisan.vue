<script setup>
import BaseModalForm from '@/components/BaseModalForm.vue'
import GroupForm from '@/modules/MasterData/GroupArisan/components/GroupArisanForm.vue'
import { useGroupArisanStore } from '@/modules/MasterData/GroupArisan/stores/GroupArisan'
import { formatRupiah } from '@/utils/formatRupiah'
import { onMounted, ref } from 'vue'


const store = useGroupArisanStore()
const search = ref('')
const showModal = ref(false)
const isEdit = ref(false)
const formRef = ref(null) // ✅ Tambah ini
const form = ref({
  kode: null,
  name: '',
  description: '',
  total_rounds: '',
  amount: '',
  start_date: '',
  status: '',
})

const headers = [
  { title: 'Kode', key: 'kode' },
  { title: 'Name', key: 'name' },
  { title: 'Description', key: 'description' },
  { title: 'Total Rounds', key: 'total_rounds' },
  { title: 'Amount', key: 'amount' },
  { title: 'Start Date', key: 'start_date' },
  { title: 'Status', key: 'status' },
  { title: 'Aksi', key: 'actions', sortable: false },
]

function openAdd() {
  Object.assign(form.value, { kode: null, name: '', description: '', total_rounds: '', amount: '', start_date: '', status: '' })
  isEdit.value = false
  showModal.value = true
}

function openEdit(item) {
  form.value = { ...item }
  isEdit.value = true
  showModal.value = true
}

async function save() {
  if (!formRef.value) return console.error('Reference not connected')
  const { valid } = await formRef.value.validate()
  if (!valid) return console.warn('Invalid form submission')

  try {
    if (isEdit.value) {
      await store.update(form.value)
    } else {
      await store.create(form.value)
    }

    // ✅ Tutup modal & refresh data
    showModal.value = false
    await store.fetch()
  } catch (err) {
    console.error('Unable to save the data:', err)
  }
}

async function del(kode) {
  if (confirm('Are you sure you want to remove this item ?')) {
    await store.remove(kode)
    await store.fetch()
  }
}

onMounted(store.fetch)
</script>

<template>
  <VCard>
    <VCardTitle class="d-flex justify-space-between align-center">
      <span>Master Group Arisan</span>
      <div class="d-flex align-center gap-2">
        <VTextField v-model="search" placeholder="Search..." prepend-inner-icon="ri-search-2-line" variant="solo-filled"
          density="compact" hide-details style="max-width: 220px" />
        <VBtn color="primary" @click="openAdd">+ Add</VBtn>
      </div>
    </VCardTitle>

    <VDataTable :headers="headers" :items="store.items" :search="search" class="elevation-1" density="comfortable">
      <template #item.amount="{ item }">
        {{ formatRupiah(item.amount) }}
      </template>

      <template #item.actions="{ item }">
        <VBtn size="small" color="primary" variant="outlined" class="me-2" @click="openEdit(item)">Edit</VBtn>
        <VBtn size="small" color="error" variant="outlined" @click="del(item.kode)">Delete</VBtn>
      </template>
    </VDataTable>

    <BaseModalForm v-model="showModal" :title="isEdit ? 'Edit Group' : 'Tambah Group'" @save="save">
      <GroupForm ref="formRef" v-model="form" :is-edit="isEdit" />
    </BaseModalForm>
  </VCard>
</template>
