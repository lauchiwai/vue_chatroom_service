<template>
    <FullScreenLayout v-if="fullScreen"/>
    <MainLayout v-else/>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import MainLayout from '@/layouts/mainLayout.vue'
import FullScreenLayout from '@/layouts/fullScreenLayout.vue'

const route = useRoute()
const fullScreen = ref<boolean>(true)

watch(() => route.meta.layout, (newLayout) => {
    if (newLayout != undefined)
        fullScreen.value = newLayout === 'fullScreen' ? true : false
  },
  { immediate: true } 
)
</script>