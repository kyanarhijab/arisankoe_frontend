<script setup>
import { useGroupArisanStore } from '@/stores/group_Arisan';
import { onMounted, ref } from 'vue';
import BaseModalForm from "../../components/BaseModalForm.vue";

const store = useGroupArisanStore()

// State Modal + Form
const showModal = ref(false)
const isEdit = ref(false)
const form = ref({ id: null, nama_group: '', keterangan: '' })

// Buka modal tambah
function openAdd() {
  form.value = { id: null, nama_group: '', keterangan: '' }
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
            <span>Master Group Arisan</span>
            <VBtn color="primary" @click="openAdd">+ Add</VBtn>
          </VCardTitle>

          <!-- DataTable -->
          <VDataTable
            :headers="[
              { text: 'ID', value: 'id' },
              { text: 'Nama Group', value: 'nama_group' },
              { text: 'Keterangan', value: 'keterangan' },
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
      :title="isEdit ? 'Edit Group Arisan' : 'Tambah Group Arisan'"
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
            <label for="firstName">First Name</label>
          </VCol>

          <VCol
            cols="12"
            md="9"
          >
            <VTextField
              id="firstName"
              v-model="firstName"
              placeholder="John"
              persistent-placeholder
            />
          </VCol>
        </VRow>
      </VCol>
      </VRow>
      
    </BaseModalForm>

  </div>
</template>
