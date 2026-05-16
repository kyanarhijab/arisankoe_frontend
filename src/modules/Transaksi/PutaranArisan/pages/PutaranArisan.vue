<script setup>
import { usePutaranArisanStore } from '@/modules/Transaksi/PutaranArisan/stores/PutaranArisan'
import { formatRupiah } from '@/utils/formatRupiah'
import { computed, ref } from 'vue'

//components
import PutaranArisanGroupForm from '@/modules/Transaksi/PutaranArisan/components/PutaranArisanGroupForm.vue'
import PutaranArisanHistoriForm from '@/modules/Transaksi/PutaranArisan/components/PutaranArisanHistoriForm.vue'

const formRef = ref()

const search = ref('')
const store = usePutaranArisanStore()
const showModalSearch = ref(false)
const showModalHistori = ref(false)
const groupkode = ref('')
const groupname = ref('')
const tanggalPutaran = ref(null)
const putaran = ref(null)
const pemenang = ref('')


// rules
const rules = {
  required: v => !!v || 'Wajib diisi',
  number: v => !v || !isNaN(v) || 'Harus angka',
}

const headers = [
  { title: 'User ID', key: 'user_id', sortable: false },
  { title: 'Nama', key: 'name', sortable: false },
  { title: 'Rp', key: 'amount_paid', sortable: false },
  { title: 'Status', key: 'status', sortable: false },
  { title: 'Actions', key: 'actions', sortable: false },
]

function openshowModalSearch() {
  showModalSearch.value = true
}

async function setSelected(item) {
  if (!item || !item.kode) {
    console.warn('Data histori tidak valid:', item)
    return
  }

  groupkode.value = item.kode
  groupname.value = item.nama
  putaran.value = item.urutan
  tanggalPutaran.value = item.tanggal
  
  showModalSearch.value = false
  await store.fetch(groupkode.value, 0)
  //await store.fetch(item.kode)
}

function openshowModalHistori() {
  showModalHistori.value = true
}

async function setSelectedHistori(item) {
  if (!item?.kode) return

  groupkode.value = item.kode
  groupname.value = item.name
  putaran.value = item.putaran
  tanggalPutaran.value = item.tgl_putaran
  pemenang.value = item.pemenang
  showModalHistori.value = false
  await store.fetch(groupkode.value, putaran.value)

  //await store.fetch(item.kode)
}

const save = async () => {
  if (!formRef.value) {
    console.error('Form belum ready')
    return
  }

  const { valid } = await formRef.value.validate()

  if (!valid) return

  try {

    const payload = {
      group_kode: groupkode.value,
      group_name: groupname.value,
      putaran: putaran.value,
      tanggal_putaran: tanggalPutaran.value,
    }

    await store.savePutaran(payload)

    await store.fetch(groupkode.value, putaran.value)


  } catch (err) {
    //console.error(err.message)
  }
}

async function bayarItem(item) {
  const data = item.raw ?? item

  if (!confirm(`Bayar untuk ${data.name}?`)) return

  try {
    await store.savePayment({
      group_id: data.group_id,
      user_id: data.user_id,
      putaran: data.round_numbers,
    })

    //useNotifyStore().notify('Pembayaran berhasil','success')
    await store.fetch(data.group_id, putaran.value)

  } catch (err) {
    //useNotifyStore().notify('Gagal bayar','error')
  }
}

async function pemenangArisan(item) {
  const data = item.raw ?? item

  if (!confirm(`Apakah Yakin ${data.name}  Pemenang?`)) return

  try {
    await store.pemenangArisan({
      group_id: data.group_id,
      user_id: data.user_id,
      putaran: data.round_numbers,
    })

    //useNotifyStore().notify('Pembayaran berhasil','success')
    await store.fetch(data.group_id, putaran.value)
    pemenang.value = data.user_id + ' - ' + data.name

  } catch (err) {
    //useNotifyStore().notify('Gagal bayar','error')
  }
}

onMounted(async () => {
  await store.fetch(groupkode.value, putaran.value)
})

const totalNominal = computed(() => {
  return store.items.reduce((sum, item) => {
    return sum + Number(item.amount_paid || 0)
  }, 0)
})

</script>

<template>
  <div>
    <VRow>
      <VCol cols="12" md="12">
        <VCard title="Putaran Arisan">
          <VCardText>
            <VForm ref="formRef" lazy-validation validate-on="blur">
              <!-- KODE ARISAN -->
              <VRow class="align-center mb-2">
                <VCol cols="12" md="2">
                  <span class="text-grey-darken-1">Kode Arisan</span>
                </VCol>
                <VCol cols="12" md="7">
                  <VRow class="align-center" no-gutters>
                    <VCol cols="4">
                      <VTextField v-model="groupkode" :rules="[rules.required]" placeholder="Kode Arisan"
                        density="compact" variant="outlined" hide-details />
                    </VCol>
                    <VCol cols="1" class="text-center">
                      -
                    </VCol>
                    <VCol cols="7">
                      <VTextField v-model="groupname" placeholder="Nama Arisan" density="compact" variant="outlined"
                        hide-details disabled />
                    </VCol>
                  </VRow>
                </VCol>
                <VCol cols="12" md="1" class="text-end">
                  <VBtn color="primary" @click="openshowModalSearch">Cari</VBtn>
                </VCol>
                <VCol cols="12" md="2" class="text-end">
                  <VBtn color="primary" @click="openshowModalHistori">Cari History</VBtn>
                </VCol>
              </VRow>
              <!-- PUTARAN -->
              <VRow class="mb-2">
                <VCol cols="12" md="2">
                  <span class="text-grey-darken-1">Putaran</span>
                </VCol>
                <VCol cols="12" md="7">
                  <VRow class="align-center" no-gutters>
                    <VCol cols="4">
                      <VTextField v-model="putaran" :rules="[rules.required, rules.number]" placeholder="Putaran"
                        type="number" density="compact" variant="outlined" hide-details />
                    </VCol>
                  </VRow>
                </VCol>
              </VRow>
              <!-- TANGGAL PUTARAN -->
              <VRow class="align-center mb-2">
                <VCol cols="12" md="2">
                  <span class="text-grey-darken-1">Tanggal Putaran</span>
                </VCol>
                <VCol cols="12" md="7">
                  <VRow class="align-center" no-gutters>
                    <VCol cols="4">
                      <VTextField v-model="tanggalPutaran" :rules="[rules.required]" type="date" variant="outlined"
                        density="compact" />
                    </VCol>
                  </VRow>
                </VCol>
              </VRow>

               <!-- PUTARAN -->
              <VRow class="mb-2">
                <VCol cols="12" md="2">
                  <span class="text-grey-darken-1">Pemenang Arisan</span>
                </VCol>
                <VCol cols="12" md="7">
                  <VRow class="align-center" no-gutters>
                    <VCol cols="12">
                      <VTextField v-model="pemenang" placeholder="Pemenang Arisan" disabled
                        type="text" density="compact" variant="outlined" hide-details />
                    </VCol>
                  </VRow>
                </VCol>
              </VRow>

              <VDivider class="my-4" />
              <VRow class="mt-2">
                <VCol cols="12" class="d-flex justify-end gap-3">
                  <VBtn color="primary" :loading="store.loading_save" @click="save">
                    Simpan
                  </VBtn>
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
            </div>
          </VCardTitle>

          <VDataTable :headers="headers" :items="store.items" :search="search" :loading="store.loading">
            <template #item.amount_paid="{ item }">
              {{ formatRupiah(item.amount_paid) }}
            </template>
            <!-- STATUS -->
            <template #item.status="{ item }">
              <VChip :color="item.status === 'BELOM BAYAR' ? 'error' : 'success'" size="small" variant="flat">
                {{ item.status }}
              </VChip>
            </template>
            <template #item.actions="{ item }">
              <div class="d-flex gap-2">
                <VBtn size="x-small" color="info" :disabled="item.status === 'SUDAH BAYAR'" @click="bayarItem(item)">
                  <VIcon icon="ri-money-dollar-circle-line" class="mr-1" />
                  PEMBAYARAN
                </VBtn>
                  <VBtn size="x-small" color="success" :disabled="item.status2 === 'SUDAH'" @click="pemenangArisan(item)">
                  <VIcon icon="ri-money-dollar-circle-line" class="mr-1" />
                  PEMENANG ARISAN
                </VBtn>
              </div>
            </template>
            <template #footer.prepend>
              <div class="pa-4 font-weight-bold">
                Total: {{ formatRupiah(totalNominal) }}
              </div>
            </template>
          </VDataTable>


        </VCard>
      </VCol>
    </VRow>
  </div>

  <!-- MODAL -->
  <BaseModalForm v-model="showModalSearch" title="Cari Arisan">
    <PutaranArisanGroupForm ref="groupFormRef" @choose="setSelected" />
    <template #actions>
      <VBtn variant="outlined" @click="showModalSearch = false">
        Tutup
      </VBtn>
    </template>
  </BaseModalForm>

  <!-- MODAL -->
  <BaseModalForm v-model="showModalHistori" title="Cari History">
    <PutaranArisanHistoriForm ref="historiFormRef" @choose-histori="setSelectedHistori" />
    <template #actions>
      <VBtn variant="outlined" @click="showModalHistori = false">
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
