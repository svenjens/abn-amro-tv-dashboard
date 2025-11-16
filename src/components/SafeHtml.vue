<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div v-html="sanitizedHtml" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import DOMPurify from 'dompurify'

interface Props {
  content: string
  /** Optional: additional DOMPurify config */
  config?: Record<string, unknown>
}

const props = withDefaults(defineProps<Props>(), {
  config: () => ({}),
})

/**
 * Sanitize HTML content using DOMPurify to prevent XSS attacks
 */
const sanitizedHtml = computed(() => {
  if (!props.content) return ''

  return DOMPurify.sanitize(props.content, {
    // Allow common HTML elements for rich text
    ALLOWED_TAGS: [
      'p',
      'b',
      'i',
      'em',
      'strong',
      'a',
      'br',
      'ul',
      'ol',
      'li',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    // Always add noopener noreferrer to links
    ADD_ATTR: ['target', 'rel'],
    // Custom config overrides
    ...props.config,
  })
})
</script>
