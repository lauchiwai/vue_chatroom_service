<template>
    <a-modal
        v-model:open="open"
        :title="props.title"
        :width="props.width"
        centered
        :closable="false"
        :maskClosable="false"
        :keyboard="false"
        :footer="null"
        class="delete-modal"
    >
        <div class="modal-content">
            <ExclamationCircleOutlined class="warning-icon" />
            <p class="message">{{ props.message }}</p>
        </div>
        <div class="modal-footer">
            <a-button @click="handleCancel">{{ props.cancelText }}</a-button>
            <a-button type="primary" danger @click="handleConfirm" :loading="loading">
                {{ props.confirmText }}
            </a-button>
        </div>
    </a-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { Modal as AModal, Button as AButton } from 'ant-design-vue';

const props = defineProps({
    title: {
        type: String,
        required: false
    },
    message: {
        type: String,
        default: '您確定要刪除此項目嗎？此操作無法復原。'
    },
    cancelText: {
        type: String,
        default: '取消'
    },
    confirmText: {
        type: String,
        default: '確認刪除'
    },
    width: {
        type: [Number, String],
        default: 420
    },
    deleteFn: {
        type: Function,
        required: true
    }
});
const open = defineModel('open', { type: Boolean, required: true });

const loading = ref(false);

const handleCancel = () => {
    open.value = false;
};

const handleConfirm = async () => {
    loading.value = true;
    try {
        await props.deleteFn();
        open.value = false;
    } finally {
        loading.value = false;
    }
};
</script>

<style lang="scss" scoped>
.delete-modal {
    .ant-modal-body {
        padding: 24px;
    }

    .modal-content {
        display: flex;
        align-items: flex-start;
        margin-bottom: 24px;

        .warning-icon {
            color: #faad14;
            font-size: 22px;
            margin-right: 16px;
            margin-top: 2px;
        }

        .message {
            margin: 0;
            color: rgba(0, 0, 0, 0.85);
            font-size: 16px;
            line-height: 1.5;
        }
    }

    .modal-footer {
        display: flex;
        justify-content: flex-end;
        gap: 8px;

        .ant-btn {
            min-width: 80px;
            border-radius: 4px;
            font-weight: 500;
            transition: all 0.2s ease;
            
            &:hover {
                transform: translateY(-2px);
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
            }
            
            &:active {
                transform: translateY(0);
            }
        }
    }
}
</style>
