<template>
    <teleport to="body">
        <div 
            v-show="show"
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

            <a-tooltip placement="top">
                <template #title>估下</template>
                <button @click="handleEnglishWordTipsEvent()">
                    <span class="icon-text">
                        <QuestionCircleOutlined />
                    </span>
                </button>
            </a-tooltip>

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
                    @click="handleTTSEvent()"
                    :class="{ active: isSpeaking }"
                >
                    <span class="icon-text">
                        <CustomerServiceOutlined :class="{ 'swaying-animation': isSpeaking }" />
                    </span>
                </button>
            </a-tooltip>

            <CollectTextButton 
                :text="selectedText"
                @text-collected="handleTextCollected"
            >
                <template #title="{ isCollected }" >
                    {{ isCollected ? '取消收藏' : '收藏文字' }}
                </template>
            </CollectTextButton>
        </div>
    </teleport>

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

    <TextLinguisticAssistantModal 
        v-if="textLinguisticAssistantModalOpen"
        v-model:open="textLinguisticAssistantModalOpen"
        :selected-text="selectedText"
    />

    <EnglishTTSModal 
        v-if="englishTTSModalOpen"
        v-model:open="englishTTSModalOpen"
        :selected-text="selectedText"
    />
</template>

<script setup lang="ts">
import {
    TranslationOutlined,
    BulbOutlined,
    QuestionCircleOutlined,
    CustomerServiceOutlined
} from '@ant-design/icons-vue';
import { ref } from 'vue';

import EnglishWordTipsModal from '@/components/englishAssistant/modals/englishWordTipsModal.vue'
import EnglishWordAssistantModal from '@/components/englishAssistant/modals/englishWordAssistantModal.vue'
import TextLinguisticAssistantModal from '@/components/englishAssistant/modals/textLinguisticAssistantModal.vue'
import EnglishTTSModal from '@/components/englishAssistant/modals/englishTTSModal.vue'
import CollectTextButton from '@/components/word/button/collectTextButton.vue'

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
const englishWordTipsModalOpen = ref(false)
const englishTTSModalOpen = ref(false)

const resetEvent = () => {
    show.value = false;
    const selection = window.getSelection();
    if (selection) selection.removeAllRanges();
}

const handleEnglishWordTipsEvent = () =>{
    resetEvent()
    englishWordTipsModalOpen.value = !englishWordTipsModalOpen.value
}

const handleEnglishWordAssistantEvent = () =>{
    resetEvent()
    englishWordAssistantModalOpen.value = !englishWordAssistantModalOpen.value
}

const handleTextLinguisticAssistantEvent = () =>{
    resetEvent()
    textLinguisticAssistantModalOpen.value = !textLinguisticAssistantModalOpen.value
}

const handleTTSEvent = () =>{
    resetEvent()
    englishTTSModalOpen.value = !englishTTSModalOpen.value
}

const handleTextCollected = () =>{
    resetEvent()
}
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
