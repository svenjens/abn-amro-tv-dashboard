<template>
  <a href="#main-content" class="skip-to-content" @click="skipToContent">
    {{ t('accessibility.skipToContent') }}
  </a>
</template>

<script setup lang="ts">

const { t } = useI18n()

function skipToContent(event: Event) {
  event.preventDefault()
  const mainContent = document.getElementById('main-content')
  if (mainContent) {
    mainContent.focus()
    mainContent.scrollIntoView()
  }
}
</script>

<style scoped>
.skip-to-content {
  position: absolute;
  top: -40px;
  left: 0;
  z-index: 100;
  padding: 8px 16px;
  background-color: #000;
  color: #fff;
  text-decoration: none;
  font-weight: 600;
  border-radius: 0 0 4px 0;
}

.skip-to-content:focus {
  top: 0;
  outline: 2px solid #ef4444;
  outline-offset: 2px;
}
</style>
