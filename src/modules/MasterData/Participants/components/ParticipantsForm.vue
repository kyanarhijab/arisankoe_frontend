<template>
  <VForm ref="formRef" class="pa-4" lazy-validation>
    <VContainer fluid>
      <VRow
        v-for="field in fields"
        :key="field.id"
        class="align-center mb-2"
        no-gutters
      >
        <VCol cols="12" md="3" class="text-md-right pr-md-4 pb-1 pb-md-0">
          <label :for="field.id" class="font-weight-medium text-caption text-grey-darken-1">
            {{ field.label }}
          </label>
        </VCol>

        <VCol cols="12" md="9">
          <VTextField
            v-if="field.component === 'VTextField'"
            :id="field.id"
            v-model="formModel[field.model]"
            v-bind="field.props"
            variant="outlined"
            density="compact"
            hide-details="auto"
          />

          <VSelect
            v-else-if="field.component === 'VSelect'"
            :id="field.id"
            v-model="formModel[field.model]"
            v-bind="field.props"
            variant="outlined"
            density="compact"
            hide-details="auto"
          />
        </VCol>
      </VRow>
    </VContainer>
  </VForm>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Object, required: true },
  isEdit: Boolean,
})

const emit = defineEmits(['update:modelValue'])

const formRef = ref(null)

// Clone model
const formModel = reactive({ ...props.modelValue })

// Sinkronisasi parent → child
watch(
  () => props.modelValue,
  val => Object.assign(formModel, val),
  { deep: true }
)

// Sinkronisasi child → parent
watch(
  formModel,
  val => emit('update:modelValue', { ...val }),
  { deep: true }
)

const rules = {
  required: v => !!v || "Wajib diisi",
}

const fields = [
  { id: 'id', label: 'Kode', model: 'id', component: 'VTextField', props: { placeholder: 'Kode Anggota', disabled: props.isEdit, rules: [rules.required] }},
  { id: 'user_id', label: 'user id', model: 'user_id', component: 'VTextField', props: { placeholder: 'user_id', rules: [rules.required] }},
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
  }
})
</script>

<style scoped>
.text-md-right { text-align: right; }
.font-weight-medium { font-weight: 500; }
</style>
