<template>
    <div class="search-bar">
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

const inputRef = ref<HTMLInputElement | null>(null);

const handleInput = (e: Event) => {
    emit('update:modelValue', (e.target as HTMLInputElement).value);
};

const emitSearch = () => {
    emit('search', props.modelValue);
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
    background: rgba(255, 255, 255, 0.86);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-radius: 28px;
    padding: 0 8px;
    border: 1px solid rgba(0, 0, 0, 0.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);

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
        
        &::placeholder {
            color: rgba(0, 0, 0, 0.3);
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
        cursor: pointer;
        border-radius: 50%;
        
        :deep(svg) {
            font-size: 22px;
        }
    }
}
</style>
