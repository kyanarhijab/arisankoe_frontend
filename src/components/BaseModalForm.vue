<script setup>

const props = defineProps({
  title: { type: String, required: true },   // Judul modal
  modelValue: { type: Boolean, required: true }, // v-model binding (open/close)
})

const emit = defineEmits(['update:modelValue', 'save'])

function close() {
  emit('update:modelValue', false)
}

function save() {
  emit('save')   // lempar event save ke parent
}
</script>

<template>
  <VDialog v-model="props.modelValue" max-width="720px">
    <VCard>
      <VCardTitle>{{ props.title }}</VCardTitle>
      <VDivider />
      <VCardText  class="pt-4">
        <!-- Slot untuk isi form -->
        <slot />
      </VCardText>
      <VCardActions>
        <VSpacer />
        <VBtn text @click="close">Cancel</VBtn>
        <VBtn color="primary" @click="save">Save</VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>
