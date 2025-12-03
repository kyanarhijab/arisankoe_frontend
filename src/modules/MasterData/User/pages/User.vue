<script setup>
import BaseModalForm from '@/components/BaseModalForm.vue'
import UserForm from '@/modules/MasterData/User/components/UserForm.vue'
import { useUserStore } from '@/modules/MasterData/User/stores/User'
import { onMounted, ref } from 'vue'

const store = useUserStore()
const search = ref('')
const showModal = ref(false)
const isEdit = ref(false)

// ⭐ Tambahkan ini
const formRef = ref(null)

const form = ref({
  username: '',
  name: '',
  password: '',
  email: '',
  role: '',
})

const headers = [
  { title: 'Username', key: 'username' },
  { title: 'Name', key: 'name' },
  { title: 'Password', key: 'password' },
  { title: 'Email', key: 'email' },
  { title: 'Role', key: 'role' },
  { title: 'Action', key: 'actions', sortable: false },
]

function openAdd() {
  Object.assign(form.value, {
    username: '',
    name: '',
    password: '',
    email: '',
    role: '',
  })

  isEdit.value = false
  showModal.value = true
}

function openEdit(item) {
  Object.assign(form.value, item)
  isEdit.value = true
  showModal.value = true
}

const save = async () => {
  // ⭐ VALIDASI LANGSUNG dari UserForm
  const { valid } = await formRef.value.validate()

  if (!valid) {
    console.warn("Invalid form submission")
    return
  }

  const data = { ...form.value }

  try {
    if (isEdit.value) await store.update(data)
    else await store.create(data)

    showModal.value = false
    await store.fetch()

  } catch (err) {
    console.error("Gagal menyimpan:", err)
  }
}

async function del(kode) {
  if (confirm('Are you sure you want to remove this item?')) {
    await store.remove(kode)
    await store.fetch()
  }
}

onMounted(() => store.fetch())
</script>

<template>
  <VCard>
    <VCardTitle class="d-flex justify-space-between align-center">
      <span>Master User</span>
      <div class="d-flex align-center gap-2">
        <VTextField v-model="search" placeholder="Search..." prepend-inner-icon="ri-search-2-line" variant="solo-filled"
          density="compact" hide-details="auto" style="max-width: 220px" />
        <VBtn color="primary" @click="openAdd">+ Add</VBtn>
      </div>
    </VCardTitle>

    <VDataTable :headers="headers" :items="store.items" :search="search" class="elevation-1" density="comfortable">
      <template #item.actions="{ item }">
        <VBtn size="small" color="primary" variant="outlined" class="me-2" @click="openEdit(item)">Edit</VBtn>
        <VBtn size="small" color="error" variant="outlined" @click="del(item.username)">Delete</VBtn>
      </template>
    </VDataTable>

    <BaseModalForm v-model="showModal" :title="isEdit ? 'Edit User' : 'Add User'" @save="save">
      <!-- ⭐ TARUH REF DISINI -->
      <UserForm v-model="form" :isEdit="isEdit" ref="formRef" />
       <template #actions>
    <VBtn variant="outlined" @click="showModal = false">Batal</VBtn>
    <VBtn color="primary" @click="save">Simpan</VBtn>
  </template>
    </BaseModalForm>
  </VCard>
</template>
