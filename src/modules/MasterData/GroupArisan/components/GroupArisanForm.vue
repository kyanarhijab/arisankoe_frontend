<template>
  <VForm ref="formRef" class="pa-4">
    <VContainer fluid>
      <VRow
        v-for="field in fields"
        :key="field.id"
        class="align-center mb-2"
        no-gutters
      >
        <!-- Label kiri -->
        <VCol cols="12" md="3" class="text-md-right pr-md-4 pb-1 pb-md-0">
          <label :for="field.id" class="font-weight-medium text-caption text-grey-darken-1">
            {{ field.label }}
          </label>
        </VCol>

        <!-- Input kanan -->
        <VCol cols="12" md="9">
          <!-- TextField umum -->
          <VTextField
            v-if="field.component === 'VTextField' && field.model !== 'amount'"
            :id="field.id"
            v-model="formModel[field.model]"
            v-bind="field.props"
            variant="outlined"
            density="compact"
            hide-details
          />

          <!-- TextField khusus Amount (format Rupiah) -->
          <VTextField
            v-else-if="field.model === 'amount'"
            :id="field.id"
            v-model="amountFormatted"
            variant="outlined"
            density="compact"
            hide-details
            v-bind="field.props"
          />

          <!-- Select -->
          <VSelect
            v-else-if="field.component === 'VSelect'"
            :id="field.id"
            v-model="formModel[field.model]"
            v-bind="field.props"
            variant="outlined"
            density="compact"
            hide-details
          />
        </VCol>
      </VRow>
    </VContainer>
  </VForm>
</template>

<script setup>
import { formatRupiah } from '@/utils/formatRupiah'
import { computed, reactive, ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Object, required: true },
  isEdit: Boolean,
})
const emit = defineEmits(['update:modelValue'])
const formRef = ref(null) 

// Reactive clone dari form agar bisa diedit tanpa langsung ubah props
const formModel = reactive({ ...props.modelValue })

// Sinkronisasi dua arah (v-model)
watch(
  () => props.modelValue,
  val => Object.assign(formModel, val),
  { deep: true }
)
watch(
  () => formModel,
  val => emit('update:modelValue', val),
  { deep: true }
)

// 💰 Format amount jadi rupiah
const amountFormatted = computed({
  get: () => formatRupiah(formModel.amount),
  set: val => {
    formModel.amount = val.replace(/\D/g, '') // ambil angka saja
  },
})

// Daftar field
const fields = [
  { id: 'kode', label: 'Kode', model: 'kode', component: 'VTextField', props: { placeholder: 'Kode', disabled: props.isEdit } },
  { id: 'name', label: 'Name', model: 'name', component: 'VTextField', props: { placeholder: 'Name' } },
  { id: 'description', label: 'Description', model: 'description', component: 'VTextField', props: { placeholder: 'Description' } },
  { id: 'total_rounds', label: 'Total Rounds', model: 'total_rounds', component: 'VTextField', props: { type: 'number', placeholder: 'Total Rounds' } },
  { id: 'amount', label: 'Amount', model: 'amount', component: 'VTextField', props: { placeholder: 'Nominal Arisan' } },
  { id: 'start_date', label: 'Start Date', model: 'start_date', component: 'VTextField', props: { type: 'date', placeholder: 'Tanggal Mulai' } },
  { id: 'status', label: 'Status', model: 'status', component: 'VSelect', props: { items: ['active', 'finished'], placeholder: 'Pilih Status' } },
]

// ✅ expose ke parent supaya bisa dipanggil
defineExpose({
  validate: async () => {
    if (!formRef.value) return { valid: false }
    const valid = await formRef.value.validate()
    return { valid }
  },
  resetValidation: () => {
    if (formRef.value?.resetValidation) formRef.value.resetValidation()
  },
})

</script>

<style scoped>
.text-md-right {
  text-align: right;
}
.font-weight-medium {
  font-weight: 500;
}
</style>
