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
          <VAutocomplete v-if="field.component === 'VSelect'" :id="field.id" v-model="formModel[field.model]"
            :items="field.getItems()" item-title="username" item-value="username" multiple chips closable-chips
            clearable variant="outlined" density="compact" placeholder="Cari user..." hide-details />
        </VCol>
      </VRow>
    </VContainer>
  </VForm>
</template>

<script setup>
import axios from '@/services/api'
import { onMounted, reactive, ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Object, required: true },
  isEdit: Boolean,
})

const emit = defineEmits(['update:modelValue'])

const formRef = ref(null)

const formModel = reactive({
  username: []
})
const masterUser = ref([])


const fields = [
  {
    id: 'username',
    label: 'User',
    component: 'VSelect',
    model: 'username',
    multiple: true,
    // 🔥 PENTING: FUNCTION, BUKAN VALUE
    getItems: () => masterUser.value ?? [],

    props: {
      itemTitle: 'username',
      itemValue: 'id',
      placeholder: 'Pilih User',
      clearable: true
    }
  }
]


/* --- Fetch Data --- */
const fetchMasterUser = async () => {
  try {
    const res = await axios.get('/users')
    masterUser.value = Array.isArray(res.data)
      ? res.data
      : res.data.data
  } catch (err) {
    masterUser.value = [] // fallback aman
  }
}

onMounted(fetchMasterUser)

/* --- Syncing --- */
// Hanya assign jika ada perubahan nyata dari props
watch(
  () => props.modelValue,
  val => Object.assign(formModel, val),
  { deep: true }
)
// Emit balik ke parent setiap ada perubahan di form local
watch(
  formModel,
  val => emit('update:modelValue', { ...val }),
  { deep: true }
)


/* --- Validation & Expose --- */
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
