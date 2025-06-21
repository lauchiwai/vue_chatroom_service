<template>
    <div class="frosted-glass-empty">
        <div class="frosted-glass-background"></div>
        <div class="frosted-glass-vibrancy"></div>
        <div class="frosted-glass-border"></div>
        <div class="empty-container">
            <a-empty :image="simpleImage" description="" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { Empty } from 'ant-design-vue';
import { computed } from 'vue';

const AEmpty = Empty;
const simpleImage = computed(() => Empty.PRESENTED_IMAGE_SIMPLE);
</script>

<style scoped lang="scss">
.frosted-glass-empty {
    width: 100%;
    height: 100%;
    border-radius: 12px;
    overflow: hidden;
    position: relative;
    
    &:hover {
        cursor: default;
        
        .frosted-glass-background {
            backdrop-filter: blur(16px) saturate(180%);
        }
        
        :deep(.ant-empty-image) {
            svg {
                transform: scale(1.1);
                opacity: 0.8;
            }
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

    .empty-container {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        position: relative;
        z-index: 4;
        
        :deep(.ant-empty) {
            .ant-empty-image {
                height: auto;
                margin: 0;
                
                svg {
                    width: 80px;
                    height: 80px;
                    color: rgba(120, 120, 120, 0.7);
                    transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
                    filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.05));
                }
            }
            
            .ant-empty-description {
                display: none;
            }
        }
    }
}
</style>
