<template>
    <a-card title="向量資料狀態檢查" class="status-card">
        <div class="loading-wrapper" v-if="isChecking">
            <a-spin  size="large" />
        </div>

        <div v-else class="status-content">
            <a-result
                v-if="dataExist"
                status="success"
                title="向量資料已存在"
                sub-title="此文章已完成向量化處理"
            >
                <template #icon>
                    <a-icon type="check-circle" theme="filled" style="color: #52c41a" />
                </template>
            </a-result>
            
            <a-result
                v-else
                status="warning"
                title="向量資料不存在"
                sub-title="此文章尚未進行向量化"
            >
                <template #icon>
                    <a-icon type="exclamation-circle" theme="filled" style="color: #faad14" />
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
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        margin-bottom: 24px;

        .loading-wrapper{
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 30% 0;
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
