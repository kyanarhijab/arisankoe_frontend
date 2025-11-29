<template>
  <VDialog :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)" max-width="700px"
    persistent>
    <VCard class="pa-2">
      <!-- 🟦 Header -->
      <VCardTitle class="d-flex justify-space-between align-center">
        <span class="text-h6 font-weight-medium">{{ title }}</span>
        <VBtn icon variant="text" @click="emit('update:modelValue', false)">
          <VIcon>mdi-close</VIcon>
        </VBtn>
      </VCardTitle>

      <VDivider></VDivider>

      <!-- 🧩 Isi konten form (slot) -->
      <VCardText>
        <slot />
      </VCardText>

      <VDivider></VDivider>

      <!-- 🟢 Tombol aksi -->
      <VCardActions class="justify-end">
        <VBtn variant="outlined" color="grey" @click="emit('update:modelValue', false)">
          Batal
        </VBtn>
        <VBtn color="primary" class="text-white" @click="emit('save')">
          Simpan
        </VBtn>
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
