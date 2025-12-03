<script setup>
import BaseModalForm from '@/components/BaseModalForm.vue'
import ParticipantsForm from '@/modules/MasterData/Participants/components/ParticipantsForm.vue'
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
  { title: 'Action', key: 'actions', sortable: false },
]

function openShow() {
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
    console.warn('Invalid form submission')
    return
  }

  const data = { ...form.value }

  try {
    if (isEdit.value) await store.update(data)
    else await store.create(data)

    showModal.value = false
    await store.fetch()
  } catch (err) {
    console.error('Gagal menyimpan:', err)
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
  <div>
    <VRow>
      <VCol cols="12" md="12">
        <VCard title="Participants of Arisan">
          <VDivider></VDivider>
          <VCardText>
            <VForm>
              <VRow class="align-center" cols="12" md="12">
                <VCol cols="12" md="1">
                  <span class="text-grey-darken-1">Kode Arisan</span>
                </VCol>
                <!-- Wrapper input From-To -->
                <VCol cols="12" md="8">
                  <VRow align-center gap-3>
                    <!-- From -->
                    <VCol cols="2">
                      <VTextField v-model="kode" id="kode" density="compact" variant="outlined" hide-details
                        placeholder="Kode Arisan" />
                    </VCol>
                    <!-- Strip "-" -->
                    <VCol cols="1" class="text-center input-tight" density="compact">
                      -
                    </VCol>
                    <!-- To -->
                    <VCol cols="4">
                      <VTextField v-model="name" id="name" density="compact" variant="outlined" hide-details
                        placeholder="Nama Arisan" disabled="disabled" />
                    </VCol>
                    <VCol cols="2" class="mt-0 mt-md-0">
                      <VBtn color="primary" ide-details @click="openShow">Search</VBtn>
                    </VCol>
                  </VRow>
                </VCol>
              </VRow>
            </VForm>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
    <VRow>
      <VCol cols="12" md="12">
        <VCard>
          <VDataTable :headers="headers" :items="store.items" :search="search" class="my-table-header"
            density="comfortable">
          </VDataTable>
        </VCard>
      </VCol>
    </VRow>

  </div>
  <BaseModalForm v-model="showModal" :title="'Search Arisan'">
    <ParticipantsForm v-model="form" ref="formRef" />
    <template #actions>
      <VBtn variant="outlined" @click="showModal = false">Tutup</VBtn>
    </template>
  </BaseModalForm>
</template>

<style scoped>
:deep(.v-table > .v-table__wrapper > table > thead > tr > th) {
  background-color: #a169ff !important;
  color: white !important;
}
</style>
