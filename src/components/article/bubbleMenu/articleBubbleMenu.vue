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
                <button @click="handleEnglishWordAssistantEvent">
                    <span class="icon-text">
                        <TranslationOutlined />
                    </span>
                </button>
            </a-tooltip>

            <a-tooltip placement="top">
                <template #title>文法分析</template>
                <button @click="handleTextLinguisticAssistantEvent">
                    <span class="icon-text">
                        <BulbOutlined />
                    </span>
                </button>
            </a-tooltip>

            <a-tooltip placement="top">
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

            <CollectTextButton 
                :text="selectedText"
                @text-collected="handleTextCollected"
            >
                <template #title="{ isCollected }">
                    {{ isCollected ? '取消收藏' : '收藏文字' }}
                </template>
            </CollectTextButton>
        </div>
    </teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { 
    TranslationOutlined, 
    BulbOutlined, 
    CustomerServiceOutlined 
} from '@ant-design/icons-vue';
import CollectTextButton from '@/components/word/button/collectTextButton.vue';
import { useEnglishAssistantStore } from '@/stores/englishAssistantStore';

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

const show = defineModel('show', { type: Boolean, required: true });
const assistantStore = useEnglishAssistantStore();
const isSpeaking = ref(false);
let resetting = false;

const resetEvent = (event?: Event) => {
    if (resetting) return;
    resetting = true;
    
    show.value = false;
    const selection = window.getSelection();
    if (selection) selection.removeAllRanges();
    if (event) {
        event.stopPropagation();
        event.preventDefault();
    }
    
    resetting = false;
};

const handleEnglishWordAssistantEvent = (event: Event) => {
    resetEvent(event);
    assistantStore.toggleWordAssistantModal(props.selectedText);
};

const handleTextLinguisticAssistantEvent = (event: Event) => {
    resetEvent(event);
    assistantStore.toggleLinguisticModal(props.selectedText);
};

const handleTTSEvent = (event: Event) => {
    resetEvent(event);
    assistantStore.toggleTTSModal(props.selectedText);
};

const handleTextCollected = (event: Event) => {
    resetEvent(event);
};
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
    will-change: transform;
}

@keyframes swaying {
    0%, 100% { transform: translateX(0) rotate(0deg); }
    15% { transform: translateX(-1px) rotate(-5deg); }
    30% { transform: translateX(1px) rotate(3deg); }
    45% { transform: translateX(-1px) rotate(-3deg); }
    60% { transform: translateX(1px) rotate(2deg); }
    75% { transform: translateX(-1px) rotate(-1deg); }
}

@keyframes fadeIn {
    from { opacity: 0; transform: translate(-50%, 8px); }
    to { opacity: 1; transform: translate(-50%, 0); }
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
