<template>
    <a-card title="向量化處理中" class="progress-card">
        <div class="loading-wrapper" >
            <a-spin  size="large" />
        </div>
        <a-progress
            :percent="progressPercent"
            :status="progressStatus"
            :stroke-color="progressColor"
            class="progress-bar"
        />
        <p class="progress-text">正在處理文章 ID: {{ articleId }} 的向量化...</p>
        <a-alert
            message="請勿關閉頁面"
            description="向量化處理可能需要一些時間，請耐心等待"
            type="info"
            show-icon
            class="alert-message"
        />
    </a-card>
</template>

<script setup lang="ts">
    import { computed } from 'vue'

    const props = defineProps({
        progressPercent: {
            type: Number,
            required: true
        },
        articleId: {
            type: Number,
            required: true
        }
    })

    const progressStatus = computed(() => {
        return props.progressPercent === 100 ? 'success' : 'active'
    })

    const progressColor = computed(() => {
        return props.progressPercent === 100 ? '#52c41a' : '#1890ff'
    })
</script>

<style lang="scss" scoped>
    .progress-card {
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        margin-bottom: 24px;

        .loading-wrapper{
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 10px 0;
        }

        :deep(.ant-card-head) {
            border-bottom: none;
        }
    }

    .progress-bar {
        margin: 24px 0;
    }

    .progress-text {
        text-align: center;
        color: rgba(0, 0, 0, 0.45);
        margin-bottom: 16px;
    }

    .alert-message {
        margin-top: 16px;
    }
</style>
