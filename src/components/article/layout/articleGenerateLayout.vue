<!-- ArticleGenerateLayout.vue -->
<template>
    <div class="article-generate-container center-box">
        <div class="generate-step-wrapper">
            <slot name="step"></slot>
        </div>

        <div class="main-content-wrapper">
            <slot name="main"></slot>
        </div>

        <div class="step-controls">
            <slot name="controls"></slot>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'ArticleGenerateLayout'
});
</script>

<style scoped lang="scss">
.center-box {
    display: flex;
    align-items: center;
    justify-content: center;
}

.article-generate-container {
    flex-direction: column;
    height: 100%;
    width: 100%;
    overflow: hidden;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    position: relative;
    padding: 6px;
    transition: all 0.3s ease;

    .generate-step-wrapper {
        flex: 0 0 auto;
        height: 45px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: 1px solid #eee;
        background-color: #f8f9fa;
        
        :deep(.sub-generate-step-wrapper) {
            width: 80%;
            padding: 12px 0;
        }
    }

    .main-content-wrapper {
        flex: 1 1 auto;
        min-height: 0;
        width: 100%;
        overflow: auto;
        background-color: #ffffff;
        padding: 5px 0;
        transition: background-color 0.3s;
        
        :deep(.article-prompt-wrapper),
        :deep(.article-reader-wrapper) {
            width: 100%;
            display: flex;
            height: 100%;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        :deep(.article-prompt-wrapper) {
            flex-direction: column;
            gap: 24px;
            
            > *:first-child {
                flex: 0 0 auto;
            }
            
            > *:last-child {
                flex: 1 1 auto;
                min-height: 0;
            }
        }
        
        :deep(.article-reader-wrapper) {
            overflow-y: auto;
            scroll-behavior: smooth;
            padding: 20px;
            box-sizing: border-box;
            background-color: #f9f9f9;
            border-radius: 8px;
            box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.05);
            
            &::-webkit-scrollbar {
                width: 6px;
            }
            
            &::-webkit-scrollbar-thumb {
                background-color: rgba(0, 0, 0, 0.2);
                border-radius: 3px;
            }
        }
    }

    .step-controls {
        flex: 0 0 auto;
        width: 100%;
        padding: 10px;
        display: flex;
        justify-content: center;
        gap: 16px;
        border-top: 1px solid #eee;
        background-color: #fff;
        position: sticky;
        bottom: 0;
        z-index: 100;
        box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
        
        :deep(.control-button) {
            min-width: 140px;
            height: 44px;
            font-size: 16px;
            border-radius: 8px;
            transition: all 0.3s;
            font-weight: 500;
            
            &:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
        }
        
        :deep(.generate-button) {
            border-color: transparent;
        }
    }
}

@media (max-width: 1024px) {
    .article-generate-container {
        .main-content-wrapper {
            padding: 15px 0;
        }
        
        .generate-step-wrapper {
            min-height: 70px;
            
            :deep(.sub-generate-step-wrapper) {
                width: 90%;
            }
        }
        
        :deep(.article-prompt-wrapper),
        :deep(.article-reader-wrapper) {
            padding: 0 15px;
        }
    }
}

@media (max-width: 768px) {
    .article-generate-container {
        border-radius: 0;
        
        .step-controls {
            padding: 16px;
            gap: 12px;
            flex-wrap: wrap;
            
            :deep(.control-button) {
                min-width: 120px;
                height: 40px;
                font-size: 14px;
                flex: 1;
            }
        }
        
        :deep(.article-prompt-wrapper),
        :deep(.article-reader-wrapper) {
            padding: 0 12px;
        }
        
        :deep(.article-reader-wrapper) {
            padding: 12px;
        }
    }
}

@media (max-width: 480px) {
    .article-generate-container {
        .generate-step-wrapper {
            min-height: 60px;
            
            :deep(.sub-generate-step-wrapper) {
                width: 95%;
                padding: 8px 0;
            }
        }
        
        .main-content-wrapper {
            padding: 10px 0;
            
            :deep(.article-prompt-wrapper) {
                gap: 16px;
            }
            
            :deep(.article-reader-wrapper) {
                padding: 8px;
            }
        }
        
        .step-controls {
            padding: 12px;
            gap: 8px;
            
            :deep(.control-button) {
                min-width: 100px;
                height: 38px;
                font-size: 13px;
            }
        }
    }
}
</style>
