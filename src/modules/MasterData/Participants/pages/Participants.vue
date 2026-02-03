<script setup>
import BaseModalForm from '@/components/BaseModalForm.vue'
import GroupArisanSearch from '@/modules/MasterData/GroupArisan/components/GroupArisanSearch.vue'
import ParticipantsForm from '@/modules/MasterData/Participants/components/ParticipantsForm.vue'
import { useParticipantsStore } from '@/modules/MasterData/Participants/stores/Participants'
import { useNotifyStore } from '@/stores/notify'
import { onMounted, ref, watch } from 'vue'

const store = useParticipantsStore()
const notify = useNotifyStore()

const search = ref('')
const showModalSearch = ref(false)
const showModalAdd = ref(false)
const formRef = ref(null)

const groupkode = ref('')
const participantkode = ref('')
const groupname = ref('')

const headers = [
  { title: 'Id', key: 'id', sortable: false },
  { title: 'Id Peserta', key: 'user_id', sortable: false },
  { title: 'Nama Peserta', key: 'user_name', sortable: false },
  { title: 'Nama Group', key: 'group_name', sortable: false },
  { title: 'Tanggal Join', key: 'join_date', sortable: false },
  { title: 'Actions', key: 'actions', sortable: false },
]

const form = ref({
  username: [],
  group_id: '',
})

function openshowModalSearch() {
  showModalSearch.value = true
}

// Child memilih row
function setSelected(item) {
  groupkode.value = item.kode
  groupname.value = item.name
  showModalSearch.value = false
}


const deleteItem = async (item) => {
  participantkode.value = item.id
  console.log('delete =>', item)

  if (confirm('Are you sure you want to remove this item?')) {
    await store.remove(participantkode.value)
    await store.fetch()
  }
}



function openshowModalAdd() {

  if (!groupkode.value) {
    notify.notify(
      'Silakan pilih Kode Arisan terlebih dahulu',
      'warning'
    )
    return
  }
  showModalAdd.value = true
}

// WATCH kode -> auto reload datatable
watch(groupkode, async val => {
  if (!val) {
    store.items = []
    return
  }
  await store.fetch(val)
})

// load awal (kosong)
onMounted(() => store.fetch(''))

const save = async () => {
  if (!formRef.value) return

  const { valid } = await formRef.value.validate()
  if (!valid) return

  try {
    await store.create({
      group_id: groupkode.value,
      users: form.value.username,
    })

    showModalAdd.value = false
    await store.fetch(groupkode.value)
  } catch (e) {
    console.error(e)
  }
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
                      <VTextField v-model="groupkode" placeholder="Kode Arisan" density="compact" variant="outlined"
                        hide-details />
                    </VCol>

                    <VCol cols="1" class="text-center">
                      -
                    </VCol>

                    <VCol cols="4">
                      <VTextField v-model="groupname" placeholder="Nama Arisan" density="compact" variant="outlined"
                        hide-details disabled />
                    </VCol>

                    <VCol cols="2">
                      <VBtn color="primary" @click="openshowModalSearch">Search</VBtn>
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
            <div class="d-flex align-center gap-2 w-25">
              <VTextField v-model="search" placeholder="Search..." prepend-inner-icon="ri-search-2-line"
                variant="solo-filled" density="compact" hide-details class="flex-grow-1" />
              <VBtn color="primary" @click="openshowModalAdd">+ Add</VBtn>
            </div>
          </VCardTitle>

          <VDataTable :headers="headers" :items="store.items" :search="search">
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
  <BaseModalForm v-model="showModalSearch" title="Search Arisan">
    <GroupArisanSearch ref="formRef" @choose="setSelected" />
    <template #actions>
      <VBtn variant="outlined" @click="showModalSearch = false">
        Tutup
      </VBtn>
    </template>
  </BaseModalForm>

  <BaseModalForm v-model="showModalAdd" title="Add Participant" @save="save">
    <ParticipantsForm v-model="form" ref="formRef" />
  </BaseModalForm>


</template>

<style scoped>
:deep(.v-table > .v-table__wrapper > table > thead > tr > th) {
  background-color: #a169ff !important;
  color: white !important;
}
</style>
