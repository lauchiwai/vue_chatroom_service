<template>
    <a-layout class="main-layout">
        <SiderBar v-if="!isMobile" />
        <!-- <MobileNav v-if="isMobile" /> -->

        <a-layout class="sub-layout">
            <div class="header-content" v-if="showHeader">
                <HeaderBar :title="title" />
            </div>
          
            <a-layout-content class="main-content">
                <div class="router-view-container">
                    <router-view />
                </div>
            </a-layout-content>
        </a-layout>
    </a-layout>
</template>

<script setup lang="ts">
import HeaderBar from '@/components/layouts/headerBar.vue'
import SiderBar from '@/components/layouts/siderBar.vue'
import MobileNav from '@/components/layouts/mobileNav.vue'

import { useScreenStore } from '@/stores/screenStore'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const store = useScreenStore()
const isMobile = computed(() => store.isMobile)

const route = useRoute()
const showHeader = ref<boolean>(true)
const title = ref<string>("")

watch(() => route.meta.showHeader, (newShowHeader) => {
    if (newShowHeader != undefined) {
        showHeader.value = newShowHeader as boolean
    }
}, { immediate: true })

watch(() => route.name, (newTitle) => {
    if (newTitle != undefined) {
        title.value = newTitle as string
    }
}, { immediate: true })
</script>

<style lang="scss" scoped>
.main-layout {
    --content-padding: 10px;
    --header-height: 64px;
    
    height: 100vh;
    display: flex;
    flex-direction: row;
    overflow: hidden;
    position: relative;

    ::v-deep(.ant-layout) {
        height: 100%;
        min-height: auto !important;
    }

    .sub-layout {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        
        .header-content {
            flex-shrink: 0;
            height: var(--header-height);
        }
          
        .main-content {
            flex: 1;
            display: flex;
            position: relative;
            padding: var(--content-padding);
            overflow: auto;
            background-color: #f5f5f5;
            min-height: calc(100vh - var(--header-height) - 2 * var(--content-padding));
            height: auto;
            
            .router-view-container {
                flex: 1;
                width: 100%;
                position: relative;
                overflow: visible;
                border-radius: 8px;
                padding: 10px;
                min-height: 100%;
            }
        }
    }

    @media (min-width: 992px) {
        .sub-layout .main-content {
            .router-view-container {
                padding: 10px;
            }
        }
    }

    @media (max-width: 991px) {
        --header-height: 56px;
        
        .sub-layout .main-content {
            padding: 0px;
            
            .router-view-container {
                padding: 12px;
            }
        }
    }
}
</style>
