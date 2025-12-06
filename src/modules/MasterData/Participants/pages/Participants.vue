<script setup>
import BaseModalForm from '@/components/BaseModalForm.vue'
import ParticipantsForm from '@/modules/MasterData/Participants/components/ParticipantsForm.vue'
import { useParticipantsStore } from '@/modules/MasterData/Participants/stores/Participants'
import { onMounted, ref } from 'vue'

const store = useParticipantsStore()

// ===== REFS =====
const search = ref('')
const showModal = ref(false)
const isEdit = ref(false)
const formRef = ref(null)

const form = ref({
  username: '',
  name: '',
  password: '',
  email: '',
  role: '',
})

// ===== TABLE HEADER =====
const headers = [
  { title: 'Username', key: 'username' },
  { title: 'Name', key: 'name' },
  { title: 'Action', key: 'actions', sortable: false },
]

// ===== MODAL HANDLER =====
function openShow() {
  showModal.value = true
}

function openEdit(item) {
  Object.assign(form.value, item)
  isEdit.value = true
  showModal.value = true
}

// ===== SAVE DATA =====
const save = async () => {
  const { valid } = await formRef.value.validate()

  if (!valid) return

  try {
    if (isEdit.value) await store.update({ ...form.value })
    else await store.create({ ...form.value })

    showModal.value = false
    await store.fetch()
  } catch (err) {
    console.error('Gagal menyimpan:', err)
  }
}

// ===== DELETE DATA =====
async function del(kode) {
  if (!confirm('Are you sure you want to remove this item?')) return
  await store.remove(kode)
  await store.fetch()
}

// ===== FETCH AWAL =====
onMounted(() => store.fetch())

// ===== PICK RESULT DARI CHILD =====
const kode = ref('')
const name = ref('')

function setSelected(item) {
  kode.value = item.kode
  name.value = item.name
  showModal.value = false
}
</script>

<template>
  <div>

    <!-- INPUT KODE + BUTTON SEARCH -->
    <VRow>
      <VCol cols="12" md="12">
        <VCard title="Participants of Arisan">
          <VDivider />

          <VCardText>
            <VForm>
              <VRow class="align-center">
                <VCol cols="12" md="1">
                  <span class="text-grey-darken-1">Kode Arisan</span>
                </VCol>

                <VCol cols="12" md="8">
                  <VRow align="center">
                    
                    <VCol cols="2">
                      <VTextField
                        v-model="kode"
                        placeholder="Kode Arisan"
                        density="compact"
                        variant="outlined"
                        hide-details
                      />
                    </VCol>

                    <VCol cols="1" class="text-center">
                      -
                    </VCol>

                    <VCol cols="4">
                      <VTextField
                        v-model="name"
                        placeholder="Nama Arisan"
                        density="compact"
                        variant="outlined"
                        hide-details
                        disabled
                      />
                    </VCol>

                    <VCol cols="2">
                      <VBtn color="primary" @click="openShow">Search</VBtn>
                    </VCol>

                  </VRow>
                </VCol>
              </VRow>
            </VForm>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- TABLE -->
    <VRow>
      <VCol cols="12" md="12">
        <VCard>
          <VCardTitle class="d-flex justify-space-between align-center">
            <span></span>

            <VTextField
              v-model="search"
              placeholder="Search..."
              prepend-inner-icon="ri-search-2-line"
              variant="solo-filled"
              density="compact"
              hide-details
              style="max-width: 220px"
            />
          </VCardTitle>

          <VDataTable
            :headers="headers"
            :items="store.items"
            :search="search"
          />
        </VCard>
      </VCol>
    </VRow>

  </div>

  <!-- MODAL -->
  <BaseModalForm v-model="showModal" title="Search Arisan">
    <ParticipantsForm ref="formRef" @choose="setSelected" />

    <template #actions>
      <VBtn variant="outlined" @click="showModal = false">
        Tutup
      </VBtn>
    </template>
  </BaseModalForm>
</template>

<style scoped>
:deep(.v-table > .v-table__wrapper > table > thead > tr > th) {
  background-color: #a169ff !important;
  color: white !important;
}
</style>
