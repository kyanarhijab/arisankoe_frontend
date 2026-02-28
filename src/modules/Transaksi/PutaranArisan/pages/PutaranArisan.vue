<script setup>
import GroupArisanSearch from '@/modules/MasterData/GroupArisan/components/GroupArisanSearch.vue';
//import PutaranArisanForm from '@/modules/MasterData/Participants/components/ParticipantsForm.vue'
import { usePutaranArisanStore } from '@/modules/Transaksi/PutaranArisan/stores/PutaranArisan';
import { useNotifyStore } from '@/stores/notify';
//import { onMounted, ref, watch } from 'vue'

const store = usePutaranArisanStore()
const notify = useNotifyStore()
const showModalSearch = ref(false)
const groupkode = ref('')
const groupname = ref('')

function openshowModalSearch() {
  showModalSearch.value = true
}

function setSelected(item) {
  groupkode.value = item.kode
  groupname.value = item.name
  showModalSearch.value = false
}


</script>

<template>
  <div>
    <VRow>
      <VCol cols="12" md="12">
        <VCard title="Putaran Arisan">
          <VCardText>
            <VForm>
              <!-- KODE ARISAN -->
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
                      <VBtn color="primary" @click="openshowModalSearch">Cari Arisan</VBtn>
                    </VCol>
                  </VRow>
                </VCol>
              </VRow>
              <!-- TANGGAL PUTARAN -->
              <VRow class="align-center">
                <VCol cols="12" md="1">
                  <span class="text-grey-darken-1">Tanggal Putaran</span>
                </VCol>
                <VCol cols="12" md="8">
                  <VRow align="center">
                    <VCol cols="2">
                      <VTextField v-model="groupkode" placeholder="Kode Arisan" density="compact" variant="outlined"
                        hide-details />
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


</template>

<style scoped>
:deep(.v-table > .v-table__wrapper > table > thead > tr > th) {
  background-color: #a169ff !important;
  color: white !important;
}
</style>
