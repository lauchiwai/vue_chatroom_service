<template>
    <a-modal
        v-model:open="modalOpen"
        :title="title"
        :width="width"
        centered
        :closable="false"
        :maskClosable="false"
        :keyboard="false"
        :footer="null"
        class="delete-modal"
    >
        <div class="modal-content">
            <ExclamationCircleOutlined class="warning-icon" />
            <p class="message">{{ message }}</p>
        </div>
        <div class="modal-footer">
            <a-button @click="handleCancel">{{ cancelText }}</a-button>
            <a-button type="primary" danger @click="handleConfirm" :loading="loading">
                {{ confirmText }}
            </a-button>
        </div>
    </a-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { Modal as AModal, Button as AButton } from 'ant-design-vue';

interface Props {
    title?: string;
    message?: string;
    cancelText?: string;
    confirmText?: string;
    width?: number | string;
    deleteFn: () => Promise<void>; 
}

const props = withDefaults(defineProps<Props>(), {
    title: '確認刪除',
    message: '您確定要刪除此項目嗎？此操作無法復原。',
    cancelText: '取消',
    confirmText: '確認刪除',
    width: 420
});

const modalOpen = ref(false);
const loading = ref(false);

const open = () => {
    modalOpen.value = true;
    loading.value = false;
};

const close = () => {
    modalOpen.value = false;
};

const handleCancel = () => {
    close();
};

const handleConfirm = async () => {
    loading.value = true;
    try {
        await props.deleteFn(); 
        close();
    } finally {
        loading.value = false;
    }
};

defineExpose({
    open,
    close
});
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
        }
    }
}
</style>