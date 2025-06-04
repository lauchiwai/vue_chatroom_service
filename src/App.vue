<template>
    <FullScreenLayout v-if="fullScreen"/>
    <MainLayout v-else/>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useScreenStore } from '@/stores/screenStore'
import { onMounted, onBeforeUnmount } from 'vue'

import MainLayout from '@/layouts/mainLayout.vue'
import FullScreenLayout from '@/layouts/fullScreenLayout.vue'

const store = useScreenStore()
const route = useRoute()
const fullScreen = ref<boolean>(true)
const handleResize = () => store.checkScreenSize()
watch(() => route.meta.layout, (newLayout) => {
    if (newLayout != undefined)
        fullScreen.value = newLayout === 'fullScreen' ? true : false
  },
  { immediate: true } 
)

onMounted(() => {
    store.checkScreenSize()
    window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
})
</script>