<template>
    <a-layout class="main-layout">
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

import SiderBar from '@/components/layouts/siderBar.vue'
import HeaderBar from '@/components/layouts/headerBar.vue'
import MobleHeaderBar from '@/components/layouts/mobleHeaderBar.vue'

const isMobile = ref(false)
const collapsed = ref(false)
const toggleCollapse = () => {
    collapsed.value = !collapsed.value
}

const checkScreenSize = () => {
    isMobile.value = window.innerWidth < 992 
}

onMounted(() => {
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', checkScreenSize)
})
</script>

<style lang="scss" scoped>
.main-layout {
    height: 100vh;
    display: flex;
    flex-direction: row; 
    overflow: hidden;

    ::v-deep(.ant-layout) {
        height: 100%;
        min-height: auto !important; 
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
            }
        }
    }
}
</style>
  