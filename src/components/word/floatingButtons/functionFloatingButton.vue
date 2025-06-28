<template>
    <div class="floating-assistant">
        <a-tooltip placement="left">
            <template #title>翻譯</template>
            <button @click="handleEnglishWordAssistantEvent">
                <span class="icon-text">
                    <TranslationOutlined />
                </span>
            </button>
        </a-tooltip>

        <a-tooltip placement="left">
            <template #title>估下</template>
            <button @click="handleEnglishWordTipsEvent">
                <span class="icon-text">
                    <QuestionCircleOutlined />
                </span>
            </button>
        </a-tooltip>

        <a-tooltip placement="left">
            <template #title>發音</template>
            <button 
                @click="handleTTSEvent"
                :class="{ active: isSpeaking }"
            >
                <span class="icon-text">
                    <CustomerServiceOutlined :class="{ 'swaying-animation': isSpeaking }" />
                </span>
            </button>
        </a-tooltip>

        <a-tooltip placement="left">
            <template #title>刪除單字</template>
            <button @click="handleDeleteEvent">
                <span class="icon-text">
                    <DeleteOutlined />
                </span>
            </button>
        </a-tooltip>
    </div>

    <EnglishWordTipsModal 
        v-if="englishWordTipsModalOpen"
        v-model:open="englishWordTipsModalOpen"
        :selected-text="selectedText"
    />

    <EnglishWordAssistantModal 
        v-if="englishWordAssistantModalOpen"
        v-model:open="englishWordAssistantModalOpen"
        :selected-text="selectedText"
    />

    <EnglishTTSModal 
        v-if="englishTTSModalOpen"
        v-model:open="englishTTSModalOpen"
        :selected-text="selectedText"
    />

    <DeleteModal
        v-model:open="deleteModalOpen"
        :delete-fn="deleteWord"
        title="刪除單字確認"
        :message="`確定要刪除單字「${selectedText}」嗎？此操作無法復原。`"
    />
</template>

<script setup lang="ts">
import {
    TranslationOutlined,
    QuestionCircleOutlined,
    CustomerServiceOutlined,
    DeleteOutlined
} from '@ant-design/icons-vue';
import { ref } from 'vue';
import { useWordStore } from '@/stores/wordStore';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router'
import { ROUTE_NAMES } from '@/router';

import EnglishWordTipsModal from '@/components/englishAssistant/modals/englishWordTipsModal.vue'
import EnglishWordAssistantModal from '@/components/englishAssistant/modals/englishWordAssistantModal.vue'
import EnglishTTSModal from '@/components/englishAssistant/modals/englishTTSModal.vue'
import DeleteModal from '@/components/common/modal/deleteModal.vue'

const props = defineProps({
    selectedText: {
        type: String,
        required: true
    }
});

const router = useRouter()
const isSpeaking = ref(false);
const englishWordAssistantModalOpen = ref(false)
const englishWordTipsModalOpen = ref(false)
const englishTTSModalOpen = ref(false)
const deleteModalOpen = ref(false)

const wordStore = useWordStore();

const handleEnglishWordTipsEvent = () => {
    englishWordTipsModalOpen.value = !englishWordTipsModalOpen.value
}

const handleEnglishWordAssistantEvent = () => {
    englishWordAssistantModalOpen.value = !englishWordAssistantModalOpen.value
}

const handleTTSEvent = () => {
    englishTTSModalOpen.value = !englishTTSModalOpen.value
}

const handleDeleteEvent = () => {
    deleteModalOpen.value = true;
};

const goWordHome = () => {
    router.push({ name: ROUTE_NAMES.WORD })
}

const deleteWord = async () => {
    try {
        const success = await wordStore.removeWordByText(props.selectedText);
        goWordHome();
        return success;
    } catch (error) {
        message.error('刪除單字時發生錯誤');
        console.error('刪除單字失敗:', error);
        return false;
    }
};
</script>

<style scoped>
.floating-assistant {
    position: fixed;
    bottom: 60px;
    right: 24px;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 16px;
}

.floating-assistant button {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: white;
    color: gray;
    border: none;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;
}

.floating-assistant button:hover {
    background: #f0f0f0;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.floating-assistant button.active {
    background: #f0f0f0;
    box-shadow: inset 0 0 0 1px #93c5fd;
}

.icon-text {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
}

.swaying-animation {
    animation: swaying 1.2s ease-in-out infinite;
}

@keyframes swaying {
    0%, 100% {
        transform: translateX(0) rotate(0deg);
    }
    15% {
        transform: translateX(-1px) rotate(-5deg);
    }
    30% {
        transform: translateX(1px) rotate(3deg);
    }
    45% {
        transform: translateX(-1px) rotate(-3deg);
    }
    60% {
        transform: translateX(1px) rotate(2deg);
    }
    75% {
        transform: translateX(-1px) rotate(-1deg);
    }
}

@media (max-width: 1200px) {
    .floating-assistant {
        bottom: 120px;
        right: 16px;
    }
}

@media (max-width: 640px) {
    .floating-assistant {
        gap: 12px;
    }
    
    .floating-assistant button {
        width: 48px;
        height: 48px;
    }
    
    .icon-text {
        font-size: 16px;
    }
}
</style>
