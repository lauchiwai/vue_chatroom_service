<template>
    <div class="frosted-glass-container">
        <MyCard :show-border="true" @click="handelAddSelectionModalEvent">
            <template #content>
                <div class="frosted-glass-background"></div>
                <div class="frosted-glass-vibrancy"></div>
                <div class="frosted-glass-border"></div>
                <div class="plus-icon-container">
                    <PlusOutlined class="plus-icon" />
                </div>
            </template>
        </MyCard>
    </div>

    <ArticleAddSelectionModal 
        v-if="addSelectionModalOpen"
        v-model:modal-open="addSelectionModalOpen"
    />
</template>

<script setup lang="ts">
import { PlusOutlined } from '@ant-design/icons-vue'
import { ref } from 'vue'

import MyCard from '@/components/common/myCard.vue';
import ArticleAddSelectionModal from '@/components/article/modals/articleAddSelectionModal.vue';

const addSelectionModalOpen = ref(false);
const handelAddSelectionModalEvent = () => {
    addSelectionModalOpen.value = !addSelectionModalOpen.value;
};
</script>

<style scoped lang="scss">
.frosted-glass-container {
    width: 100%;
    height: 100%;
    border-radius: 12px;
    overflow: hidden;
    position: relative;
    &:hover {
        cursor: pointer;
        
        .frosted-glass-background {
            backdrop-filter: blur(16px) saturate(180%);
        }
        
        .plus-icon {
            transform: scale(1.15);
            color: #007AFF;
        }
    }

    .frosted-glass-background {
        position: absolute;
        inset: 0;
        background: rgba(245, 245, 247, 0.6);
        backdrop-filter: blur(12px) saturate(160%);
        -webkit-backdrop-filter: blur(12px) saturate(160%);
        z-index: 1;
        transition: backdrop-filter 0.4s cubic-bezier(0.25, 0.1, 0.25, 1);
        border-radius: 12px;
    }

    .frosted-glass-vibrancy {
        position: absolute;
        inset: 0;
        background: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0.3) 0%,
            rgba(255, 255, 255, 0.15) 100%
        );
        z-index: 2;
        pointer-events: none;
        border-radius: 12px;
        
        &::after {
            content: "";
            position: absolute;
            inset: 0;
            background-image: url('data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="2" numOctaves="2" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%" height="100%" filter="url(%23noise)" opacity="0.04"/%3E%3C/svg%3E');
        }
    }

    .frosted-glass-border {
        position: absolute;
        top: 0.5px;
        left: 0.5px;
        right: 0.5px;
        bottom: 0.5px;
        width: calc(100% - 1px);
        height: calc(100% - 1px);
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.3);
        z-index: 3;
        pointer-events: none;
    }

    .plus-icon-container {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        padding: 15%;
        box-sizing: border-box;
        position: relative;
        z-index: 4;
        background: white;
    }
    
    .plus-icon {
        color: rgba(90, 90, 90, 0.8);
        transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
        font-size: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
        filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.05));
        
        &:hover {
            color: #007AFF;
            filter: drop-shadow(0 1px 2px rgba(0, 122, 255, 0.2));
        }
    }
}
</style>
