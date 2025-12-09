<script setup>
import BaseModalForm from '@/components/BaseModalForm.vue'
import ParticipantsForm from '@/modules/MasterData/Participants/components/ParticipantsForm.vue'
import { useParticipantsStore } from '@/modules/MasterData/Participants/stores/Participants'
import { onMounted, ref, watch } from 'vue'

const store = useParticipantsStore()

const search = ref('')
const showModal = ref(false)

const kode = ref('')
const name = ref('')

const headers = [
  { title: 'Id', key: 'id', sortable: false },
  { title: 'Id Peserta', key: 'username', sortable: false },
  { title: 'Nama Peserta', key: 'nama_peserta', sortable: false },
  { title: 'Nama Group', key: 'nama_group', sortable: false },
  { title: 'Tanggal Join', key: 'join_date', sortable: false },
  { title: 'Actions', key: 'actions', sortable: false },
]

function openShow() {
  showModal.value = true
}

// Child memilih row
function setSelected(item) {
  kode.value = item.kode
  name.value = item.name
  showModal.value = false
}

function editItem(item) {
  console.log('edit =>', item)
  // TODO: buka modal edit / isi form edit
}

function deleteItem(item) {
  console.log('delete =>', item)
  // TODO: panggil API delete
}

// WATCH kode -> auto reload datatable
watch(kode, async val => {
  if (!val) {
    store.items = []
    return
  }
  await store.fetch(val)
})

// load awal (kosong)
onMounted(() => store.fetch(''))
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
>
  <template #item.actions="{ item }">
    <div class="d-flex gap-2">
      <VBtn size="x-small" color="error" @click="deleteItem(item)">
        <VIcon icon="ri-delete-bin-6-line" class="mr-1" /> delete
      </VBtn>
    </div>
  </template>
</VDataTable>
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
