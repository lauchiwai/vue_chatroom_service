<template>
    <a-card title="向量資料狀態檢查" class="status-card">
        <div class="loading-wrapper" v-if="isChecking">
            <a-spin size="large" />
        </div>

        <div v-else class="status-content">
            <a-result
                v-if="dataExist"
                status="success"
                title="向量資料已存在"
                sub-title="此文章已完成向量化處理"
            >
                <template #icon>
                    <CheckCircleFilled style="color: #52c41a; font-size: 72px" />
                </template>
            </a-result>
            
            <a-result
                v-else
                status="warning"
                title="向量資料不存在"
                sub-title="此文章尚未進行向量化"
            >
                <template #icon>
                    <ExclamationCircleFilled style="color: #faad14; font-size: 72px" />
                </template>
                <template #extra>
                    <a-button type="primary" @click="$emit('start-vectorization')">
                        開始向量化
                    </a-button>
                </template>
            </a-result>
        </div>
    </a-card>
</template>

<script setup lang="ts">
import { CheckCircleFilled, ExclamationCircleFilled } from '@ant-design/icons-vue';

defineProps({
    dataExist: {
        type: Boolean,
        required: true
    },
    isChecking: {
        type: Boolean,
        required: true
    }
})

defineEmits(['start-vectorization'])
</script>

<style lang="scss" scoped>
.status-card {
    border-radius: 8px;
    margin-bottom: 24px;
    border: none;

    .loading-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 15% 0;
    }
    
    :deep(.ant-card-head) {
        border-bottom: none;
    }
}

.status-content {
    padding: 24px 0;
    text-align: center;
}
</style>
