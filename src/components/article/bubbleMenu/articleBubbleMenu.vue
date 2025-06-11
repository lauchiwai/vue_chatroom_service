<template>
    <teleport to="body">
        <div
            v-if="show"
            class="bubble-menu"
            :data-instance="instanceId"
            :style="position"
        >
            <a-tooltip placement="top">
                <template #title>翻譯</template>
                <button @click="handleEnglishWordAssistantEvent()">
                    <span class="icon-text">
                        <TranslationOutlined />
                    </span>
                </button>
            </a-tooltip>

            <!-- <a-tooltip placement="top">
                <template #title>估下</template>
                <button @click="handleHighlight">
                    <span class="icon-text">
                        <QuestionCircleOutlined />
                    </span>
                </button>
            </a-tooltip> -->

            <a-tooltip placement="top">
                <template #title>文法分析</template>
                <button @click="handleTextLinguisticAssistantEvent()">
                    <span class="icon-text">
                        <BulbOutlined />
                    </span>
                </button>
            </a-tooltip>

            <a-tooltip placement="top">
                <template #title>發音</template>
                <button 
                    @click="handlePronunciation"
                    :class="{ active: isSpeaking }"
                >
                    <span class="icon-text">
                        <CustomerServiceOutlined :class="{ 'swaying-animation': isSpeaking }" />
                    </span>
                </button>
            </a-tooltip>
        </div>
    </teleport>

    <EnglishWordAssistantModal 
        v-if="englishWordAssistantModalOpen"
        v-model:open="englishWordAssistantModalOpen"
        :selected-text="selectedText"
    />

    <TextLinguisticAssistantModal 
        v-if="textLinguisticAssistantModalOpen"
        v-model:open="textLinguisticAssistantModalOpen"
        :selected-text="selectedText"
    />
</template>

<script setup lang="ts">
import {
    TranslationOutlined,
    BulbOutlined,
    CustomerServiceOutlined
} from '@ant-design/icons-vue';
import { ref, watch, onBeforeUnmount } from 'vue';
import { tts } from '@/utils/common/ttsUtil';

import EnglishWordAssistantModal from '@/components/englishAssistant/modals/englishWordAssistantModal.vue'

import TextLinguisticAssistantModal from '@/components/englishAssistant/modals/textLinguisticAssistantModal.vue'
const props = defineProps({
    selectedText: {
        type: String,
        required: true
    },
    position: {
        type: Object,
        required: true,
        default: () => ({ top: '0px', left: '0px' })
    },
    instanceId: {
        type: String,
        required: true
    }
});

const show = defineModel('show', { type: Boolean, required: true })

const isSpeaking = ref(false);
const englishWordAssistantModalOpen = ref(false)
const textLinguisticAssistantModalOpen = ref(false)

tts.registerStatusCallback((status : string) => {
    isSpeaking.value = status === 'speaking';
});

watch(() => show.value, (newVal) => {
    if (!newVal) {
        tts.stop();
    }
});

const handlePronunciation = () => {
    if (!props.selectedText) return;
    tts.toggle(props.selectedText);
};

const handleEnglishWordAssistantEvent = () =>{
    englishWordAssistantModalOpen.value = !englishWordAssistantModalOpen.value
    show.value = !show.value
}
const handleTextLinguisticAssistantEvent = () =>{
    textLinguisticAssistantModalOpen.value = !textLinguisticAssistantModalOpen.value
    show.value = !show.value
}

onBeforeUnmount(() => {
    tts.stop();
    tts.unregisterStatusCallback();
});
</script>

<style scoped>
.bubble-menu {
    position: fixed;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    padding: 6px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    transform: translateX(-50%);
    z-index: 2147483647;
    display: flex;
    gap: 4px;
    animation: fadeIn 0.15s ease-out;
}

.bubble-menu button {
    padding: 6px 10px;
    border: none;
    background: #f8fafc;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
}

.bubble-menu button:hover {
    background: #e2e8f0;
    transform: translateY(-1px);
}

.bubble-menu button.active {
    background: #dbeafe;
    box-shadow: inset 0 0 0 1px #93c5fd;
}

.icon-text {
    display: inline-flex;
    align-items: center;
    gap: 6px;
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

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translate(-50%, 8px);
    }
    to {
        opacity: 1;
        transform: translate(-50%, 0);
    }
}

@media (max-width: 640px) {
    .bubble-menu {
        gap: 2px;
        padding: 4px;
    }

    .bubble-menu button {
        padding: 4px 8px;
    }
}
</style>
