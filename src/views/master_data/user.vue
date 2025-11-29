<script setup>
import { useUserStore } from '@/stores/user';
import { onMounted, ref } from 'vue';
import BaseModalForm from "../../components/BaseModalForm.vue";

const store = useUserStore()

// State Modal + Form
const showModal = ref(false)
const isEdit = ref(false)
const form = ref({ id: null, username: '', password: '', name: '', email: '', role: '' })
const formRef = ref(null)

// Setting password visibility
const isVisible = ref(false)
function toggle() { isVisible.value = !isVisible.value }

const headers = [
  { title: 'Username', key: 'username' },
  { title: 'Name', key: 'name' },
  { title: 'Password', key: 'password' },
  { title: 'Email', key: 'email' },
  { title: 'Role', key: 'role' },
  { title: 'Aksi', key: 'actions', sortable: false },
]

const items = [
  'admin',
  'anggota'
]

// Buka modal tambah
function openAdd() {
  form.value = { id: null, username: '', password: '', name: '', email: '', role: '' }
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
            <span>Master User</span>
            <VBtn color="primary" @click="openAdd">+ Add</VBtn>
          </VCardTitle>

          <!-- DataTable -->
          <VDataTable :headers="headers" :items="store.items" class="elevation-1">
            <template #item.actions="{ item }">
              <VBtn size="small" color="primary" variant="outlined" class="me-2" @click="openEdit(item)">
                Edit
              </VBtn>
              <VBtn size="small" color="error" variant="outlined" @click="del(item.username)">
                Delete
              </VBtn>
            </template>
          </VDataTable>
        </VCard>
      </VCol>
    </VRow>

    <!-- Modal Form -->
    <BaseModalForm v-model="showModal" :title="isEdit ? 'Edit User' : 'Tambah User'" @save="save">
      <!-- Isi form lewat slot -->
      <v-form ref="formRef">
        <VRow>
          <VCol cols="12">
            <VRow no-gutters>
              <!-- 👉 Username -->
              <VCol cols="12" md="3">
                <label for="username">Username</label>
              </VCol>
              <VCol cols="12" md="9">
                <VTextField id="username" v-model="form.username" placeholder="username" persistent-placeholder />
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
              <!-- 👉 password -->
              <VCol cols="12" md="3">
                <label for="password">Password</label>
              </VCol>
              <VCol cols="12" md="9">
                <VTextField id="password" v-model="form.password" :type="isVisible ? 'text' : 'password'"
                  placeholder="password" autocomplete="current-password"
                  :append-inner-icon="isVisible ? 'ri-eye-off-line' : 'ri-eye-line'" @click:append-inner="toggle"
                  hide-details="auto" dense outlined
                  :rules="[v => !!v || 'Password wajib diisi', v => v.length >= 6 || 'Minimal 6 karakter']" />
              </VCol>
            </VRow>
          </VCol>
          <VCol cols="12">
            <VRow no-gutters>
              <!-- 👉 email -->
              <VCol cols="12" md="3">
                <label for="email">Email</label>
              </VCol>
              <VCol cols="12" md="9">
                <VTextField id="email" v-model="form.email" type="email" placeholder="email" persistent-placeholder
                  outlined dense required :rules="[
                    v => !!v || 'Email wajib diisi',
                    v => /.+@.+\..+/.test(v) || 'Format email tidak valid'
                  ]" />
              </VCol>
            </VRow>
          </VCol>
          <VCol cols="12">
            <VRow no-gutters>
              <!-- 👉 role -->
              <VCol cols="12" md="3">
                <label for="role">Role</label>
              </VCol>
              <VCol cols="12" md="9">
                <VSelect v-model="form.role" :items="items" label="Pilih Role" />
              </VCol>
            </VRow>
          </VCol>
        </VRow>
      </v-form>
    </BaseModalForm>
  </div>
</template>
