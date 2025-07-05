<template>
    <div class="search-bar" :class="{ 'search-bar--focused': isFocused }">
        <button @click="emitSearch" class="search-bar__button">
            <SearchOutlined />
        </button>
        <input
            ref="inputRef"
            type="text"
            :value="modelValue"
            @input="handleInput"
            placeholder="search"
            @keyup.enter="emitSearch"
            @focus="handleFocus"
            @blur="handleBlur"
            class="search-bar__input"
        />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { SearchOutlined } from '@ant-design/icons-vue';

const props = defineProps({
    modelValue: { type: String, default: '' }
});

const emit = defineEmits(['update:modelValue', 'search']);

const isFocused = ref(false);
const inputRef = ref<HTMLInputElement | null>(null);

const handleInput = (e: Event) => {
    emit('update:modelValue', (e.target as HTMLInputElement).value);
};

const emitSearch = () => {
    emit('search', props.modelValue);
};

const handleFocus = () => {
    isFocused.value = true;
};

const handleBlur = () => {
    isFocused.value = false;
};

defineExpose({
    focus: () => {
        inputRef.value?.focus();
        inputRef.value?.select();
    }
});
</script>

<style scoped lang="scss">
.search-bar {
    display: flex;
    width: 100%;
    max-width: 600px;
    height: 56px;
    align-items: center;
    /* 磨砂玻璃核心样式 */
    background: rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-radius: 28px;
    padding: 0 8px;
    transition: all 0.3s ease;
    /* 玻璃边缘效果 */
    border: 1px solid rgba(255, 255, 255, 0.18);
    box-shadow: 
        0 8px 32px rgba(0, 0, 0, 0.1),
        inset 0 0 12px rgba(255, 255, 255, 0.25);
    
    &--focused, &:hover {
        background: rgba(255, 255, 255, 0.35);
        box-shadow: 
            0 12px 40px rgba(0, 0, 0, 0.15),
            inset 0 0 16px rgba(255, 255, 255, 0.35);
    }

    &__input {
        flex: 1;
        padding: 0 16px;
        border: none;
        background: transparent;
        font-size: 1.1rem;
        outline: none;
        height: 100%;
        color: #222;
        font-weight: 500;
        text-shadow: 0 1px 1px rgba(255, 255, 255, 0.5);
        
        &::placeholder {
            color: rgba(0, 0, 0, 0.5);
            transition: color 0.2s ease;
            text-shadow: 0 1px 2px rgba(255, 255, 255, 0.3);
        }
    }

    &__button {
        width: 48px;
        height: 48px;
        display: flex;
        border: none;
        background-color: transparent;
        align-items: center;
        justify-content: center;
        color: rgba(0, 0, 0, 0.75);
        transition: all 0.2s ease;
        cursor: pointer;
        border-radius: 50%;
        
        &:hover {
            color: #000;
            background: rgba(255, 255, 255, 0.3);
            box-shadow: 
                0 0 8px rgba(255, 255, 255, 0.5),
                inset 0 0 6px rgba(255, 255, 255, 0.4);
        }
        
        :deep(svg) {
            font-size: 22px;
            filter: drop-shadow(0 1px 1px rgba(255, 255, 255, 0.7));
        }
    }
}
</style>
