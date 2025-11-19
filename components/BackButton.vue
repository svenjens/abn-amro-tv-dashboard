<script setup lang="ts">
const { t } = useI18n()
const router = useRouter()

interface Props {
  variant?: 'header' | 'default'
  customHandler?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  customHandler: undefined,
})

const handleClick = () => {
  if (props.customHandler) {
    props.customHandler()
  } else {
    router.back()
  }
}
</script>

<template>
  <button
    :class="[
      'inline-flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 rounded-lg px-2 py-1',
      variant === 'header'
        ? 'text-white hover:text-primary-300 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-primary-800'
        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-primary-500',
    ]"
    :aria-label="t('navigation.back')"
    @click="handleClick"
  >
    <Icon name="heroicons:chevron-left" class="h-5 w-5" />
    {{ t('navigation.back') }}
  </button>
</template>
