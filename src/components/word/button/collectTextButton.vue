<template>
    <a-tooltip placement="top">
        <template #title>
            <slot name="title" :isCollected="isCollected">
            </slot>
        </template>
        <button 
            @click="handleCollectClick"
            :class="{ active: isCollected }"
            :disabled="loading || isDebouncing"
        >
            <span class="icon-text">
                <StarOutlined 
                    v-if="!loading && !isDebouncing" 
                    :class="{ 'star-active': isCollected }" 
                />
                <LoadingOutlined v-else />
            </span>
        </button>
    </a-tooltip>
</template>

<script setup lang="ts">
import type { WordRequest } from '@/types/word/word';

import { ref, onUnmounted, watchEffect } from 'vue';
import { StarOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import { useWordStore } from '@/stores/wordStore';

const props = defineProps({
    text: {
        type: String,
        required: true
    }
});

const wordStore = useWordStore();
const isCollected = ref(false);
const loading = ref(false);
const isDebouncing = ref(false); 
const debounceTimer = ref<number | null>(null);

const debounceCheck = (text: string) => {
    isDebouncing.value = true;
    
    if (debounceTimer.value !== null) {
        clearTimeout(debounceTimer.value);
    }
    
    debounceTimer.value = setTimeout(() => {
        isDebouncing.value = false;
        checkCollectionStatus(text);
    }, 1000) as unknown as number;
};


const checkCollectionStatus = async (text: string) => {
    if (!text.trim()) {
        isCollected.value = false;
        return;
    }

    try {
        loading.value = true;
        isCollected.value = await wordStore.checkWordExistsByText(text);
    } catch (error) {
        console.error('检查收藏状态失败:', error);
    } finally {
        loading.value = false;
    }
};

watchEffect(() => {
    const trimmedText = props.text.trim();
    if (trimmedText.length > 0) {
        debounceCheck(props.text);
    }
});

const handleCollectClick = async () => {
    if (loading.value || isDebouncing.value || !props.text.trim()) return;

    try {
        loading.value = true;
        
        if (isCollected.value) {
            const success = await wordStore.removeWordByText(props.text);
            if (success) {
                isCollected.value = false;
            }
        } else {
            let request : WordRequest = {
                wordText: props.text
            }
            const result = await wordStore.addWord(request);
            if (result) {
                isCollected.value = true;
            }
        }
    } catch (error) {
        console.error('收藏操作失败:', error);
    } finally {
        loading.value = false;
    }
};

onUnmounted(() => {
    if (debounceTimer.value !== null) {
        clearTimeout(debounceTimer.value);
    }
});
</script>

<style scoped>
.icon-text {
    display: inline-flex;
    align-items: center;
    gap: 6px;
}

.star-active {
    color: #faad14;
    animation: pulse 1.5s infinite;
}

@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
}

button.active {
    background: #fffbe6;
    box-shadow: inset 0 0 0 1px #ffe58f;
}

button {
    padding: 4px 8px;
    border: none;
    background: #f8fafc;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
}

button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}
</style>
