<script setup>
import { useParticipantsStore } from '@/stores/participants'
import axios from 'axios'
import { onMounted, ref } from 'vue'

const store = useParticipantsStore()

// State Modal + Form
const showModal = ref(false)
const isEdit = ref(false)
const form = ref({
  id_user: '',
  name: '',
  description: '',
  total_rounds: '',
  amount: '',
  start_date: '',
  status: '',
})
const formRef = ref(null)

// State
const selected = ref(null)
const usersList = ref([])
const loading = ref(false)
const search = ref('')

// Fungsi fetch produk dari backend
const fetchUser = async (val = '') => {
  loading.value = true
  try {
    const token = localStorage.getItem('token')
    const res = await axios.get(`http://localhost/arisankoe-backend/get_users.php?q=${val}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    usersList.value = res.data
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const headers = [
  { title: 'Kode Anggota', key: 'id' },
  { title: 'User ID', key: 'user_id' },
  { title: 'Nama', key: 'nama' },
  { title: 'Group ID', key: 'group_id' },
  { title: 'Tgl Gabung', key: 'join_date' },
  { title: 'Status', key: 'status' },
  { title: 'Aksi', key: 'actions', sortable: false },
]

const items = ['active', 'resigned']

// Buka modal tambah
function openAdd() {
  form.value = { kode: null, name: '', description: '', total_rounds: '', amount: '', start_date: '', status: '' }
  isEdit.value = false
  showModal.value = true
  fetchUser()
}

// Buka modal edit
function openEdit(item) {
  form.value = { ...item }
  isEdit.value = true
  showModal.value = true
}

// Simpan data
async function save() {
  const { valid } = await formRef.value.validate() // ✅ destructure object

  if (!valid) {
    console.log('Form tidak valid')
    return
  }

  if (isEdit.value) {
    await store.update(form.value)
  } else {
    await store.create(form.value)
  }

  showModal.value = false
}

// Hapus data
async function del(username) {
  if (confirm('Yakin hapus data ini?')) {
    await store.remove(username)
  }
}

// Ambil data saat pertama kali load
onMounted(store.fetch)
</script>

<template>
  <div>
    <!-- Judul + Tombol Add -->
    <VRow>
      <VCol cols="12">
        <VCard>
          <VCardTitle class="d-flex justify-space-between align-center">
            <span>Master Participant of Group Arisan </span>
          </VCardTitle>
          
        
        </VCard>
      </VCol>
    </VRow>

    
  </div>
</template>
