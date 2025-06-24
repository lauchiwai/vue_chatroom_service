<template>
    <div class="floating-assistant">
        <button 
            class="main-button"
            @click="toggleMenu"
            :class="{ active: isMenuOpen }"
        >
            <span class="icon-text">
                <TranslationOutlined v-if="!isMenuOpen" />
                <CloseOutlined v-else />
            </span>
        </button>

        <div class="menu-items" v-show="isMenuOpen">
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
        </div>
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
</template>

<script setup lang="ts">
import {
    TranslationOutlined,
    QuestionCircleOutlined,
    CustomerServiceOutlined,
    CloseOutlined
} from '@ant-design/icons-vue';
import { ref } from 'vue';

import EnglishWordTipsModal from '@/components/englishAssistant/modals/englishWordTipsModal.vue'
import EnglishWordAssistantModal from '@/components/englishAssistant/modals/englishWordAssistantModal.vue'
import EnglishTTSModal from '@/components/englishAssistant/modals/englishTTSModal.vue'

const props = defineProps({
    selectedText: {
        type: String,
        required: true
    }
});

const isMenuOpen = ref(false);
const isSpeaking = ref(false);
const englishWordAssistantModalOpen = ref(false)
const englishWordTipsModalOpen = ref(false)
const englishTTSModalOpen = ref(false)

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
};

const handleEnglishWordTipsEvent = () => {
    englishWordTipsModalOpen.value = !englishWordTipsModalOpen.value
    isMenuOpen.value = false;
}

const handleEnglishWordAssistantEvent = () => {
    englishWordAssistantModalOpen.value = !englishWordAssistantModalOpen.value
    isMenuOpen.value = false;
}

const handleTTSEvent = () => {
    englishTTSModalOpen.value = !englishTTSModalOpen.value
    isMenuOpen.value = false;
}
</script>

<style scoped>
.floating-assistant {
    position: fixed;
    bottom: 60px;
    right: 24px;
    z-index: 1000;
    display: flex;
    flex-direction: column-reverse;
    align-items: flex-end;
    gap: 12px;
}

.main-button {
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

.main-button:hover {
    background: #f0f0f0;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.main-button.active {
    background: #f0f0f0;
    transform: rotate(180deg);
}

.menu-items {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 12px;
    animation: fadeIn 0.2s ease-out;
}

.menu-items button {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: white;
    border: 1px solid #e5e7eb;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}

.menu-items button:hover {
    background: #f0f0f0;
    transform: translateX(-2px);
}

.menu-items button.active {
    background: #f0f0f0;
    box-shadow: inset 0 0 0 1px #93c5fd;
}

.icon-text {
    display: flex;
    align-items: center;
    justify-content: center;
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
        transform: translateY(8px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (max-width: 1200px) {
    .floating-assistant {
        bottom: 120px;
        right: 16px;
    }
}


@media (max-width: 640px) {

    
    .main-button {
        width: 48px;
        height: 48px;
    }
    
    .menu-items button {
        width: 36px;
        height: 36px;
    }
}
</style>
