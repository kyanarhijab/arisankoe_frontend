<template>
  <VForm ref="formRef" class="pa-4" lazy-validation>
    <VContainer fluid>
      <VRow v-for="field in fields" :key="field.id" class="align-center mb-2" no-gutters>
        <!-- Label kiri -->
        <VCol cols="12" md="3" class="text-md-right pr-md-4 pb-1 pb-md-0">
          <label :for="field.id" class="font-weight-medium text-caption text-grey-darken-1">
            {{ field.label }}
          </label>
        </VCol>
        <!-- Input kanan -->
        <VCol cols="12" md="9">
          <!-- Input Amount (hanya satu!) -->
          <VTextField v-if="field.model === 'amount'" v-model="amountFormatted" variant="outlined" density="compact"
            hide-details="auto" v-bind="field.props" />
          <!-- Input TextField umum (kecuali amount) -->
          <VTextField v-else-if="field.component === 'VTextField'" v-model="formModel[field.model]" variant="outlined"
            density="compact" hide-details="auto" v-bind="field.props" />
          <!-- Select -->
          <VSelect v-else-if="field.component === 'VSelect'" :id="field.id" v-model="formModel[field.model]"
            v-bind="field.props" variant="outlined" density="compact" hide-details />
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

const formModel = reactive({ ...props.modelValue })

watch(
  () => props.modelValue,
  val => Object.assign(formModel, val),
  { deep: true }
)

watch(
  formModel,
  val => emit('update:modelValue', { ...val }),
  { deep: true }
)

const rules = {
  required: v => !!v || 'Wajib diisi',
}

const amountFormatted = computed({
  get: () => formatRupiah(formModel.amount),
  set: val => {
    formModel.amount = Number(val.replace(/\D/g, ''))
  },
})

const fields = [
  {
    id: 'kode',
    label: 'Kode',
    model: 'kode',
    component: 'VTextField',
    props: {
      placeholder: 'Kode',
      disabled: props.isEdit,
      rules: props.isEdit ? [] : [rules.required],
    },
  },
  {
    id: 'name',
    label: 'Nama',
    model: 'name',
    component: 'VTextField',
    props: { rules: [rules.required] },
  },
  {
    id: 'description',
    label: 'Keterangan',
    model: 'description',
    component: 'VTextField',
    props: { rules: [rules.required] },
  },
  {
    id: 'total_rounds',
    label: 'Total Putaran',
    model: 'total_rounds',
    component: 'VTextField',
    props: { type: 'number', rules: [rules.required] },
  },
  {
    id: 'amount',
    label: 'Nilai',
    model: 'amount',
    component: 'VTextField',
    props: { rules: [rules.required] },
  },
  {
    id: 'start_date',
    label: 'Tanggal Mulai',
    model: 'start_date',
    component: 'VTextField',
    props: { type: 'date', rules: [rules.required] },
  },
  {
    id: 'status',
    label: 'Status',
    model: 'status',
    component: 'VSelect',
    props: {
      items: ['active', 'finished'],
      rules: [rules.required],
    },
  },
]

defineExpose({
  async validate() {
    const result = await formRef.value.validate()
    return { valid: result.valid }
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
