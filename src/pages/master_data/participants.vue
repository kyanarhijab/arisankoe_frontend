<script setup>
import { useParticipantsStore } from '@/stores/participants';
import { onMounted, ref } from 'vue';
import BaseModalForm from "../../components/BaseModalForm.vue";

const store = useParticipantsStore()

// State Modal + Form
const showModal = ref(false)
const isEdit = ref(false)
const form = ref({ kode: null, name: '', description: '', total_rounds: '', amount: '', start_date: '', status: '' })
const formRef = ref(null)

// Setting password visibility
const isVisible = ref(false)
function toggle() { isVisible.value = !isVisible.value }
//format rupiah
function formatRupiah(angka) {
  if (!angka) return ''
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(angka)
}

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

const items = [
  'active',
  'finished'
]



// Computed untuk binding ke input
const amountFormatted = computed({
  get() {
    return formatRupiah(form.value.amount)
  },
  set(val) {
    // ambil hanya angka
    form.value.amount = val.replace(/\D/g, '')
  },
})

// Buka modal tambah
function openAdd() {
  form.value = { kode: null, name: '', description: '', total_rounds: '', amount: '', start_date: '', status: '' }
  isEdit.value = false
  showModal.value = true
}

// Buka modal edit
function openEdit(item) {
  form.value = { ...item }
  isEdit.value = true
  showModal.value = true
}

// Simpan data
async function save() {
  const { valid } = await formRef.value.validate()   // ✅ destructure object

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
            <span>Master Anggota Arisan </span>
            <VBtn color="primary" @click="openAdd">+ Add</VBtn>
          </VCardTitle>

          <!-- DataTable -->
          <VDataTable :headers="headers" :items="store.items" class="elevation-1">
            <template #item.amount="{ item }">
                    {{ formatRupiah(item.amount) }}
            </template>
            <template #item.actions="{ item }">
              <VBtn size="small" color="primary" variant="outlined" class="me-2" @click="openEdit(item)">
                Edit
              </VBtn>
              <VBtn size="small" color="error" variant="outlined" @click="del(item.kode)">
                Delete
              </VBtn>
            </template>
          </VDataTable>
        </VCard>
      </VCol>
    </VRow>

    <!-- Modal Form -->
    <BaseModalForm v-model="showModal" :title="isEdit ? 'Edit Group' : 'Tambah Group'" @save="save">
      <!-- Isi form lewat slot -->
      <v-form ref="formRef">
        <VRow>
          <VCol cols="12">
            <VRow no-gutters>
              <!-- 👉 kode -->
              <VCol cols="12" md="3">
                <label for="kode">Kode</label>
              </VCol>
              <VCol cols="12" md="9">
                <VTextField id="kode" v-model="form.kode" placeholder="kode" persistent-placeholder :disabled="isEdit" />
              </VCol>
            </VRow>
          </VCol>
          <VCol cols="12">
            <VRow no-gutters>
              <!-- 👉 name -->
              <VCol cols="12" md="3">
                <label for="name">Name</label>
              </VCol>
              <VCol cols="12" md="9">
                <VTextField id="name" v-model="form.name" placeholder="name" persistent-placeholder />
              </VCol>
            </VRow>
          </VCol>
          <VCol cols="12">
            <VRow no-gutters>
              <!-- 👉 description -->
              <VCol cols="12" md="3">
                <label for="description">Description</label>
              </VCol>
              <VCol cols="12" md="9">
                <VTextField id="description" v-model="form.description" placeholder="description" 
                persistent-placeholder />
              </VCol>
            </VRow>
          </VCol>
          <VCol cols="12">
            <VRow no-gutters>
              <!-- 👉 total rounds -->
              <VCol cols="12" md="3">
                <label for="total_rounds">Total Rounds</label>
              </VCol>
              <VCol cols="12" md="9">
                <VTextField id="total_rounds" v-model="form.total_rounds"  type="number"
                  placeholder="total rounds" persistent-placeholder outlined dense
                  :rules="[v => !!v || 'Wajib diisi', v => /^[0-9]+$/.test(v) || 'Hanya angka']" />
              </VCol>
            </VRow>
          </VCol>
          <VCol cols="12">
            <VRow no-gutters>
              <!-- 👉 amounts -->
              <VCol cols="12" md="3">
                <label for="amount">Amount</label>
              </VCol>
              <VCol cols="12" md="9">
                <VTextField id="amount" v-model="amountFormatted" placeholder="amount"
                  persistent-placeholder outlined dense :rules="[v => !!v || 'Wajib diisi']" />
              </VCol>
            </VRow>
          </VCol>
          <VCol cols="12">
            <VRow no-gutters>
              <!-- 👉 Start Date -->
              <VCol cols="12" md="3">
                <label for="start_date">Start Date</label>
              </VCol>
              <VCol cols="12" md="9">
                <VTextField id="start_date" v-model="form.start_date" type="date" placeholder="Pilih tanggal mulai"
                  persistent-placeholder outlined dense required />
              </VCol>
            </VRow>
          </VCol>
          <VCol cols="12">
            <VRow no-gutters>
              <!-- 👉 status -->
              <VCol cols="12" md="3">
                <label for="status">Status</label>
              </VCol>
              <VCol cols="12" md="9">
                <VSelect v-model="form.status" :items="items" label="Pilih Status" />
              </VCol>
            </VRow>
          </VCol>
        </VRow>
      </v-form>
    </BaseModalForm>
  </div>
</template>
