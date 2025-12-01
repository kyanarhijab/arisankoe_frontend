<script setup>
//import BaseModalForm from '@/components/BaseModalForm.vue'
//import ParticipantsForm from '@/modules/MasterData/Participants/components/ParticipantsForm.vue'
import { useParticipantsStore } from '@/modules/MasterData/Participants/stores/Participants'
import { onMounted, ref } from 'vue'

const store = useParticipantsStore()
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
      <span>Participants</span>
    </VCardTitle>
    

  </VCard>
</template>
