<script setup lang="ts">
interface Props {
  title: string
  message: string
  headingLevel?: 'h1' | 'h2' | 'h3' | 'h4'
}

withDefaults(defineProps<Props>(), {
  headingLevel: 'h2',
})
</script>

<template>
  <div class="text-center py-16 px-4" role="status">
    <NuxtImg
      src="/empty-state-illustration.png"
      alt=""
      class="mx-auto h-48 w-48 object-contain opacity-50 dark:opacity-30"
      aria-hidden="true"
      width="192"
      height="192"
      loading="lazy"
      format="webp"
      :quality="85"
    />
    <component :is="headingLevel" class="mt-6 text-lg font-medium text-gray-900 dark:text-gray-100">
      {{ title }}
    </component>
    <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
      {{ message }}
    </p>
    <slot name="action" />
  </div>
</template>
