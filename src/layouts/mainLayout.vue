<template>
    <a-layout class="main-layout">
        <SiderBar v-if="isPc && showSideBar" />
        <MobileNav v-if="!isPc && showMobileNav" />

        <a-layout class="sub-layout">
            <MobileHead v-if="!isPc && showMobileHeader"/>
            <Breadcrumb v-if="showBreadcrumb" />
          
            <a-layout-content class="main-content">
                <div class="router-view-container" 
                    :class="[
                        !isPc && showMobileNav ? 'mobile-nav-padding' : '',
                        !isPc && showMobileHeader ? 'mobile-header-padding' : '',
                    ]">
                    <router-view />
                </div>
            </a-layout-content>
        </a-layout>
    </a-layout>
</template>

<script setup lang="ts">
import { useScreenStore } from '@/stores/screenStore'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import SiderBar from '@/components/layouts/siderBar.vue'
import MobileNav from '@/components/layouts/mobileNav.vue'
import Breadcrumb from '@/components/layouts/breadcrumb.vue'
import MobileHead from '@/components/layouts/mobileHead.vue'

const store = useScreenStore()
const isPc = computed(() => store.isPc)
const route = useRoute()
const title = ref<string>("")
const showHeader = ref<boolean>(true)
const showSideBar = ref<boolean>(false)
const showMobileNav = ref<boolean>(false)
const showMobileHeader = ref<boolean>(false) 
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

    if (newMeta.showMobileHeader != undefined) {
        showMobileHeader.value = newMeta.showMobileHeader as boolean
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
    --mobile-header-height: 20px;
    
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
                transition: padding 0.3s ease;
            }

            .mobile-nav-padding {
                padding-bottom: 80px;
            }
            
            .mobile-header-padding {
                padding-top: var(--mobile-header-height);
            }
        }
    }

    @media (max-width: 991px) {
        --header-height: 56px;
        --breadcrumb-height: 36px;
        
        .sub-layout .main-content {
            padding: 0px;
        }
    }
}
</style>
