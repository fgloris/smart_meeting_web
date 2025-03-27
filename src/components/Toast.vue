<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{
  message: string
  duration?: number
}>()

const emit = defineEmits<{
  (e: 'hide'): void
}>()

const isVisible = ref(true)

onMounted(() => {
  setTimeout(() => {
    isVisible.value = false
    emit('hide')
  }, props.duration || 1000)
})
</script>

<template>
  <Transition name="fade">
    <div v-if="isVisible" class="toast">
      {{ message }}
    </div>
  </Transition>
</template>

<style scoped>
.toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 10px 20px;
  border-radius: 20px;
  z-index: 9999;
  font-size: 14px;
  backdrop-filter: blur(10px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
