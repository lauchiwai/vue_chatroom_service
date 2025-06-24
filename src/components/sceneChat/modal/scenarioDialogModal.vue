<template>
    <a-modal
        :open="modalOpen"
        :maskClosable="sceneChatStore.sceneChatSessionList.length === 0"
        :keyboard="sceneChatStore.sceneChatSessionList.length === 0"
        @ok="handleSubmit"
        @cancel="handleCancel"
        :width="600"
        :ok-button-props="{ disabled: !isFormValid }"
    >
        <a-form
            ref="formRef"
            :model="formState"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 16 }"
            autocomplete="off"
        >
            <a-form-item
                label="用戶角色"
                name="userRole"
                :rules="[{ required: true, message: '請輸入用戶角色' }]"
            >
                <a-input
                    v-model:value="formState.userRole"
                    placeholder="例如：顧客"
                />
            </a-form-item>

            <a-form-item
                label="AI角色"
                name="aiRole"
                :rules="[{ required: true, message: '請輸入AI角色' }]"
            >
                <a-input
                    v-model:value="formState.aiRole"
                    placeholder="例如：咖啡師"
                />
            </a-form-item>
            
            <a-form-item
                label="場景描述"
                name="scene"
                :rules="[{ required: true, message: '請輸入場景描述' }]"
            >
                <a-textarea
                    v-model:value="formState.scene"
                    placeholder="例如：咖啡店點單場景"
                    :rows="3"
                    show-count
                    :maxlength="100"
                />
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script setup lang="ts">
import type { FormInstance } from 'ant-design-vue';
import { reactive, ref, computed } from 'vue';
import { useRouter } from 'vue-router'
import { useSceneChatStore } from '@/stores/sceneChatStore'
import { ROUTE_NAMES } from '@/router';
import { Modal } from 'ant-design-vue';

const modalOpen = defineModel('modalOpen', { type: Boolean, required: true });
const emit = defineEmits(['submit', 'cancel']);
const router = useRouter()
const sceneChatStore = useSceneChatStore()
const formRef = ref<FormInstance>();
const formState = reactive({
    scene: '',
    userRole: '',
    aiRole: ''
});

const isFormValid = computed(() => {
    return formState.scene.trim() !== '' && 
           formState.userRole.trim() !== '' && 
           formState.aiRole.trim() !== '';
});

const handleSubmit = () => {
    formRef.value?.validate()
        .then(() => {
            emit('submit', { ...formState });
            modalOpen.value = false;
            formState.scene = '';
            formState.userRole = '';
            formState.aiRole = '';
        })
};

const handleCancel = () => {
    if (sceneChatStore.sceneChatSessionList.length === 0) {
        Modal.confirm({
            content: '目前沒有舊的場景對話, 返回將回到首頁',
            okText: '确定',
            cancelText: '取消',
            onOk() {
                modalOpen.value = false;
                goHome();
            },
            onCancel() {
                modalOpen.value = true;
            }
        });
    } else {
        modalOpen.value = false;
    }
};

const goHome = () => {
    router.push({ name: ROUTE_NAMES.HOME })
}
</script>
