<template>
  <VForm ref="formRef" class="pa-4" lazy-validation>
    <VContainer fluid>
      <VRow
        v-for="field in fields"
        :key="field.id"
        class="align-center mb-2"
        no-gutters
      >
        <!-- Label kiri -->
        <VCol cols="12" md="3" class="text-md-right pr-md-4 pb-1 pb-md-0">
          <label
            :for="field.id"
            class="font-weight-medium text-caption text-grey-darken-1"
          >
            {{ field.label }}
          </label>
        </VCol>

        <!-- Input kanan -->
        <VCol cols="12" md="9">
          <VSelect
            v-if="field.component === 'VSelect'"
            :id="field.id"
            v-model="formModel[field.model]"
            v-bind="field.props"
            :multiple="field.multiple"
            :chips="field.multiple"
            closable-chips
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

import { reactive, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Object, required: true },
  isEdit: Boolean,
})

const emit = defineEmits(['update:modelValue'])

const formRef = ref(null)

const formModel = reactive({
  barang_ids: [] // ⚠️ WAJIB array
})

// Sinkronisasi parent → child
watch(
  () => props.modelValue,
  val => Object.assign(formModel, val),
  { deep: true },
)

// Sinkronisasi child → parent
watch(formModel, val => emit('update:modelValue', { ...val }), { deep: true })

const rules = {
  required: v => !!v || 'Wajib diisi',
}



const fields = [
  {
    id: 'barang',
    label: 'Barang',
    component: 'VSelect',
    model: 'barang_ids',
    multiple: true,
    props: {
      items: masterBarang,       // hasil fetch API
      itemTitle: 'nama',
      itemValue: 'id',
      placeholder: 'Pilih Barang',
      clearable: true
    }
  }
]

defineExpose({
  formData: formModel,

  async validate() {
    if (!formRef.value) return { valid: false }
    const result = await formRef.value.validate()
    return { valid: result.valid }
  },

  resetValidation() {
    formRef.value?.resetValidation()
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
