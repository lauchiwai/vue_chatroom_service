<template>
    <button 
        class="float-btn"
        @click="emit('click')"
    >
        <slot name="icon">
            <CommentOutlined style="font-size: 20px;"/>
        </slot>
    </button>
</template>

<script setup lang="ts">
import { CommentOutlined } from '@ant-design/icons-vue'

import { defineProps, defineEmits } from 'vue';

const emit = defineEmits(['click']);
</script>

<style scoped lang="scss">
.float-btn {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 1px solid #E0E0E0;
    background-color: white;
    color: black;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    position: relative;
    
    .default-icon {
        width: 16px;
        height: 16px;
    }
    
    &:hover {
        transform: scale(1.05);
    }
    
    &:active {
        transform: scale(0.95);
    }
}

@media (max-width: 767px) {
    .float-btn {
        width: 42px;
        height: 42px;
    }
}
</style>
