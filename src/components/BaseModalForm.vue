<template>
  <VDialog :model-value="modelValue" 
           @update:model-value="emit('update:modelValue', $event)" 
           max-width="700px">
    <VCard>
      <VCardTitle class="d-flex justify-space-between align-center">
        <span class="text-h6 font-weight-medium">{{ title }}</span>
        <VBtn icon variant="text" @click="emit('update:modelValue', false)">
          <VIcon>mdi-close</VIcon>
        </VBtn>
      </VCardTitle>

      <VCardText>
        <slot />
      </VCardText>

      <!-- Selalu render actions -->
      <VDivider />
      <VCardActions class="justify-end">
        <slot name="actions">
          <!-- fallback -->
          <VBtn variant="outlined" color="grey" @click="emit('update:modelValue', false)">
            Batal
          </VBtn>
          <VBtn color="primary" class="text-white" @click="emit('save')">
            Simpan
          </VBtn>
        </slot>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup>
const props = defineProps({
  modelValue: Boolean,
  title: String,
})
const emit = defineEmits(['update:modelValue', 'save'])
</script>

<style scoped>
.v-card {
  border-radius: 12px;
}

.v-card-title {
  padding: 16px;
}

.v-card-text {
  padding-top: 20px;
}

.v-card-actions {
  padding: 16px;
}
</style>
