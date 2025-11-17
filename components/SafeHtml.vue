<template>
  <!-- 
    Content is already sanitized server-side in API routes
    This component is now just a safe wrapper for v-html
  -->
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div v-html="content" />
</template>

<script setup lang="ts">
/**
 * SafeHtml component
 * 
 * Note: HTML sanitization now happens server-side in API routes for better performance
 * This component is kept for backwards compatibility and as a semantic wrapper
 */

interface Props {
  content: string
}

defineProps<Props>()
</script>
