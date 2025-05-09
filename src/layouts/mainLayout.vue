<template>
    <a-layout class="main-layout" :data-theme="themeStore.currentTheme">
        <SiderBar v-model:collapsed="collapsed" v-if="!isMobile"/>
        
        <a-layout class="sub-layout">
            <MobleHeaderBar v-if="isMobile"/>

            <HeaderBar 
                v-else
                v-model:collapsed="collapsed" 
                @toggle-collapse="toggleCollapse" 
            />
            
            <a-layout-content class="main-content">
                <div class="router-view-container">
                <router-view />
                </div>
            </a-layout-content>
        </a-layout>
    </a-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useThemeStore } from '@/stores/themeStore'

import SiderBar from '@/components/layouts/siderBar.vue'
import HeaderBar from '@/components/layouts/headerBar.vue'
import MobleHeaderBar from '@/components/layouts/mobleHeaderBar.vue'

const themeStore = useThemeStore()

const isMobile = ref(false)
const collapsed = ref(false)
const toggleCollapse = () => {
    collapsed.value = !collapsed.value
}

const checkScreenSize = () => {
    isMobile.value = window.innerWidth < 992 
}

onMounted(() => {
    themeStore.initialize() 
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', checkScreenSize)
})
</script>

<style lang="scss">
.main-layout {
    height: 100vh;
    display: flex;
    flex-direction: row;
    overflow: hidden;

    @include theme(background-color, background);
    @include theme(color, text);
    transition: all 0.3s ease;

    :deep(.ant-layout) {
        height: 100%;
        min-height: auto !important;
        @include theme(background-color, background);
    }

    .sub-layout {
        flex: 1;
        overflow: hidden;

        .main-content {
            flex: 1;
            display: flex;
            position: relative;
            padding: 0;

            .router-view-container {
                flex: 1;
                min-height: 0;
                position: relative;
                @include theme(background-color, form-bg);
            }
        }
    }
}
</style>