<template>
    <DraggableResizableModal
        v-model:open="open"
        :mask="false"
        :css-style="{top:'5vh'}"
        :enable-resize="true"
        :enable-draggable="true"
        :contentPadding="'10px'"
    >
        <template #contents>
            <div class="pronunciation-modal">
                <div class="text-display">
                    <span>{{ text }}</span>
                </div>
                
                <div class="controls">
                    <a-button 
                        type="primary"
                        @click="handleTogglePlayback()"
                    >
                        <template #icon>
                            <CustomerServiceOutlined :class="{ 'swaying-animation': isSpeaking }" />
                        </template>
                        {{ isSpeaking ? '停止' : '開始' }}
                    </a-button>
                </div>
            </div>
        </template>
    </DraggableResizableModal>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount, watchEffect } from 'vue';
import { CustomerServiceOutlined } from '@ant-design/icons-vue';
import { tts } from '@/utils/common/ttsUtil';

import DraggableResizableModal from '@/components/common/modal/draggableResizableModal.vue';

type TTSStatus = 'idle' | 'speaking' | 'error';
const props = defineProps({
    selectedText: {
        type: String,
        required: true
    },
});

const open = defineModel('open', { type: Boolean, required: true });

const isSpeaking = ref(false);
const isLoading = ref(false);
const text = ref('')

tts.registerStatusCallback((status: TTSStatus) => {
    isSpeaking.value = status === 'speaking';
    if (status === 'idle' || status === 'error') {
        isLoading.value = false;
    }
});

const handleTogglePlayback = () => {
    if (!text.value) return;
    
    if (isSpeaking.value) {
        tts.stop();
        return;
    }

    isLoading.value = true;
    const success = tts.speak(text.value);
    
    if (!success) {
        isLoading.value = false;
        isSpeaking.value = false;
    }
};

const stopTTS = () => {
    if (tts.getStatus() === 'speaking') {
        tts.stop();
    }
};

watchEffect(() => {
    const trimmedText = props.selectedText.trim();
    if (trimmedText.length > 0) {
        text.value = props.selectedText;
        handleTogglePlayback()
    }
});

watch(open, (newVal) => {
    if (!newVal) {
        stopTTS();
    }
});

onBeforeUnmount(() => {
    tts.unregisterStatusCallback();
    stopTTS();
});
</script>

<style scoped>
.pronunciation-modal {
    padding: 16px 8px;
}

.text-display {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 24px;
    text-align: center;
    font-size: 1.2em;
    border: 1px solid #e8e8e8;
}

.controls {
    display: flex;
    gap: 12px;
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
</style>
