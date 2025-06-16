<template>
    <FullScreenLayout v-if="shouldUseFullScreen"/>
    <MainLayout v-else/>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import MainLayout from '@/layouts/mainLayout.vue'
import FullScreenLayout from '@/layouts/fullScreenLayout.vue'

const route = useRoute()

const shouldUseFullScreen = computed(() => {
    if (route.meta.layout === 'fullScreen') return true
    return false
})
</script>
