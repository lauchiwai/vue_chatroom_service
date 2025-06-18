<template>
    <div class="empty-container">
        <div class="empty-content">
            <div class="empty-icon">
                <slot name="icon">
                    <FolderOpenOutlined />
                </slot>
            </div>
            
            <div class="empty-text">
                <h3 v-if="title" class="empty-title">{{ title }}</h3>
                <p v-if="description" class="empty-description">{{ description }}</p>
                <slot></slot>
            </div>
            
            <div v-if="showButton" class="empty-action">
                <slot name="action">
                    <a-button type="primary" @click="handleButtonClick">
                        {{ buttonText }}
                    </a-button>
                </slot>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { FolderOpenOutlined } from '@ant-design/icons-vue';
import { Button as AButton } from 'ant-design-vue';
import type { ButtonType } from 'ant-design-vue/es/button/buttonTypes';

interface Props {
    title?: string;
    description?: string;
    showButton?: boolean;
    buttonText?: string;
    buttonType?: ButtonType;
}

const props = withDefaults(defineProps<Props>(), {
    title: '暫無數據',
    description: '當前沒有找到相關內容',
    showButton: true,
    buttonText: '刷新試試',
    buttonType: 'primary'
});

const emit = defineEmits(['button-click']);

const handleButtonClick = () => {
    emit('button-click');
};
</script>

<style scoped lang="scss">
.empty-container {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    color: rgba(0, 0, 0, 0.45);
    
    .empty-content {
        max-width: 500px;
        margin: 0 auto;
        
        .empty-icon {
            font-size: 64px;
            line-height: 1;
            margin-bottom: 24px;
            color: #bfbfbf;
            
            :deep(svg) {
                width: 1em;
                height: 1em;
                fill: currentColor;
            }
        }
        
        .empty-title {
            margin-bottom: 8px;
            color: rgba(0, 0, 0, 0.85);
            font-size: 18px;
            font-weight: 500;
            line-height: 1.5;
        }
        
        .empty-description {
            margin-bottom: 24px;
            font-size: 14px;
            line-height: 1.5;
        }
        
        .empty-action {
            margin-top: 16px;
        }
    }
}
</style>
