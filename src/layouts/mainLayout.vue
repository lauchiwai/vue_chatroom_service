<template>
    <a-layout class="main-layout">
        <SiderBar v-if="!isMobile && showSideBar" />
        <MobileNav v-if="isMobile && showMobileNav" />

        <a-layout class="sub-layout">
            <Breadcrumb v-if="!showBreadcrumb" />
          
            <a-layout-content class="main-content">
                <div class="router-view-container" :class="isMobile && showMobileNav ? 'mobile-nav-padding' : '' ">
                    <router-view />
                </div>
            </a-layout-content>
        </a-layout>
    </a-layout>
</template>

<script setup lang="ts">
import SiderBar from '@/components/layouts/siderBar.vue'
import MobileNav from '@/components/layouts/mobileNav.vue'
import Breadcrumb from '@/components/layouts/breadcrumb.vue'

import { useScreenStore } from '@/stores/screenStore'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const store = useScreenStore()
const isMobile = computed(() => store.isMobile)

const route = useRoute()
const title = ref<string>("")
const showHeader = ref<boolean>(true)
const showSideBar = ref<boolean>(false)
const showMobileNav = ref<boolean>(false)
const showBreadcrumb = ref<boolean>(false) 

watch(() => route.meta, (newMeta) => {
    if (newMeta.showHeader != undefined) {
        showHeader.value = newMeta.showHeader as boolean
    } 
    if (newMeta.showSideBar != undefined) {
        showSideBar.value = newMeta.showSideBar as boolean
    }
    if (newMeta.showMobileNav != undefined) {
        showMobileNav.value = newMeta.showMobileNav as boolean
    }
    if (newMeta.showBreadcrumb != undefined) { 
        showBreadcrumb.value = newMeta.showBreadcrumb as boolean
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
            flex-direction: column;
            position: relative;
            padding: var(--content-padding);
            background-color: #f5f5f5;
            min-height: calc(100vh - var(--header-height) - 2 * var(--content-padding));
            height: auto;

            .router-view-container {
                flex: 1;
                width: 100%;
                position: relative;
                overflow: visible;
                border-radius: 8px;
                min-height: 100%;
                overflow: auto;
            }

            .mobile-nav-padding{
                padding-bottom: 80px;
            }
        }
    }

    @media (max-width: 991px) {
        --header-height: 56px;
        
        .sub-layout .main-content {
            padding: 0px;
        }
    }
}
</style>
