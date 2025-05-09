<template>
    <div class="full-screen-layout" :data-theme="themeStore.currentTheme">
        <router-view />
    </div>
</template>

<script setup lang="ts">
import { useThemeStore } from '@/stores/themeStore'
import { onMounted } from 'vue'
const themeStore = useThemeStore()

onMounted(() => {
    themeStore.initialize()
})
</script>

<style lang="scss">
.full-screen-layout {
    height: 100vh;
    @include theme(background-color, background);
    @include theme(color, text);
    transition: all 0.3s ease;

    :deep(.child-component) {
        @include theme(border-color, border);
    }
}
</style>