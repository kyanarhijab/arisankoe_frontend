import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotifyStore = defineStore('notify', () => {
  const show = ref(false)
  const message = ref('')
  const color = ref('success') // bisa 'success', 'error', 'warning'

  function notify(msg, type = 'success') {
    message.value = msg
    color.value = type
    show.value = true
  }

  return { show, message, color, notify }
})
