<script setup>
import { useUserStore } from '@/stores/user';
import { onMounted, ref } from 'vue';
import BaseModalForm from "../../components/BaseModalForm.vue";

const store = useUserStore()

// State Modal + Form
const showModal = ref(false)
const isEdit = ref(false)
const form = ref({ username: '', password: '', name: '' , email: '' , role: ''   })

//setting password
const password = ref('')
const isVisible = ref(false)

function toggle() { isVisible.value = !isVisible.value }

// Buka modal tambah
function openAdd() {
  form.value = { username: '', password: '', name: '' , email: '' , role: ''  }
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
  if (isEdit.value) {
    await store.update(form.value)
  } else {
    await store.create(form.value)
  }
  showModal.value = false
}

// Hapus data
async function del(id) {
  if (confirm('Yakin hapus data ini?')) {
    await store.remove(id)
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
          <VDataTable
            :headers="[
              { text: 'Username', value: 'username' },
              { text: 'Name', value: 'name' },
              { text: 'Password', value: 'password' },
              { text: 'Email', value: 'email' },
              { text: 'Role', value: 'role' },
              { text: 'Aksi', value: 'actions', sortable: false }
            ]"
            :items="store.items"
            class="elevation-1"
          >
            <template #item.actions="{ item }">
              <VBtn size="small" color="primary" variant="outlined" class="me-2" @click="openEdit(item)">
                Edit
              </VBtn>
              <VBtn size="small" color="error" variant="outlined" @click="del(item.id)">
                Delete
              </VBtn>
            </template>
          </VDataTable>
        </VCard>
      </VCol>
    </VRow>

    <!-- Modal Form -->
    <BaseModalForm
      v-model="showModal"
      :title="isEdit ? 'Edit User' : 'Tambah User'"
      @save="save"
    >
      <!-- Isi form lewat slot -->
      <VRow>
      <VCol cols="12">
        <VRow no-gutters>
          <!-- 👉 First Name -->
          <VCol
            cols="12"
            md="3"
          >
          <label for="username">Username</label>
          </VCol>
          <VCol
            cols="12"
            md="9"
          >
          <VTextField
            id="username"
            v-model="username"
            placeholder="username"
            persistent-placeholder
          />
          </VCol>
        </VRow>
      </VCol>
      <VCol cols="12">
        <VRow no-gutters>
          <!-- 👉 First Name -->
          <VCol
            cols="12"
            md="3"
          >
          <label for="password">Password</label>
          </VCol>
          <VCol
            cols="12"
            md="9"
          >
          <VTextField
            id="password"
            v-model="password"
            :type="isVisible ? 'text' : 'password'"
            placeholder="......"
            autocomplete="current-password"
            :append-inner-icon="isVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
            @click:append-inner="toggle"
            hide-details="auto"
            dense
            outlined
            :rules="[v => !!v || 'Password wajib diisi', v => v.length >= 6 || 'Minimal 6 karakter']"
          />
          </VCol>
        </VRow>
      </VCol>
      </VRow>
      
    </BaseModalForm>

  </div>
</template>
