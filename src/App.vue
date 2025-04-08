<template>
    <FullScreenLayout v-if="fullScreen"/>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import FullScreenLayout from '@/layouts/fullScreenLayout.vue'

const route = useRoute()
const fullScreen = ref(true)

watch(() => route.meta.layout, (newLayout) => {
    if (newLayout != undefined)
        fullScreen.value = newLayout === 'fullScreen' ? true : false
  },
  { immediate: true } 
)
</script>