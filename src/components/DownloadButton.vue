<script setup lang="ts">
defineProps<{
  Main: string
  Sub: string
}>()
</script>

<template>
  <div class="download-section">
    <button class="download-button">
      {{ Main }}
      <p class="version">{{ Sub }}</p>
    </button>
  </div>
</template>

<style scoped>
.download-section {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.download-button {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 12px 36px;
  border-radius: 24px;
  font-size: 1.2em;
  cursor: pointer;
  transition: background-color 0.3s;
}

.download-button:hover {
  background: #45a049;
}

.version {
  font-size: 0.6em;
  margin: 0;
}
</style>
