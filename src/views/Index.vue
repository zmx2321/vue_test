<template>
  <demo v-if="pageType === 'demo'" />
  <single v-else />
</template>

<script setup>
import { ref } from 'vue'
import Demo from './demo/index.vue'
import Single from './single/index.vue'

import { useRouter } from 'vue-router'
const router = useRouter()

const pageType = ref(import.meta.env.VITE_PUBLIC_PAGETYPE)

switch (pageType.value) {
  case 'demo':
    router.push('/demo')
    break
  case 'single':
    router.push('/single')
    break
  default:
    break
}
</script>

<style scoped></style>
