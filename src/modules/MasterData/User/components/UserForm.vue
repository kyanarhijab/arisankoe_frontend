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
  email: v => /.+@.+\..+/.test(v) || "Email tidak valid",
}

const fields = [
  { id: 'username', label: 'Username', model: 'username', component: 'VTextField', props: { placeholder: 'Username', disabled: props.isEdit, rules: [rules.required] }},
  { id: 'password', label: 'Password', model: 'password', component: 'VTextField', props: { placeholder: 'Password', rules: [rules.required] }},
  { id: 'name', label: 'Name', model: 'name', component: 'VTextField', props: { placeholder: 'Name', rules: [rules.required] }},
  { id: 'email', label: 'Email', model: 'email', component: 'VTextField', props: { type: 'email', placeholder: 'Email', rules: [rules.required, rules.email] }},
  { id: 'role', label: 'Role', model: 'role', component: 'VSelect', props: { items: ['admin', 'peserta'], placeholder: 'Choose Role', rules: [rules.required] }},
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
