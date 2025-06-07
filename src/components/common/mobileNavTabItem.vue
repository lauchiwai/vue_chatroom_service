<template>
    <div class="tab-item"
        :class="selectedKeys.includes(item.key) ? 'active' : ''"
        @click="handleClick(item)"
    >
        <component :is="item.icon()" class="icon" />
        <span class="tab-label">{{ item.label }}</span>
    </div>
</template>

<script setup lang="ts">
import type { MenuItem } from '@/stores/siderStore'
import { defineProps, defineEmits, ref } from 'vue';

const props = defineProps({
    item: {
        type: Object as () => MenuItem,
        required: true,
    },
    selectedKeys: {
        type: Array as () => string[],
        required: true,
    }
});

const emit = defineEmits(['item-click']);

const handleClick = (item: MenuItem) => {
    emit('item-click', item.key);
};
</script>

<style scoped>
.tab-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-decoration: none;
    color: #666;
    padding: 5px;
    transition: all 0.3s ease;
    cursor: pointer;
    font-size: 20px;
}

.tab-item.active {
    color: #2894FF;
}

.tab-item:hover {
    opacity: 0.8;
    border-radius: 4px;
    background-color: #F0F0F0;
    transform: scale(1.1);
}

.icon {
    width: 24px;
    height: 24px;
}

.tab-label {
    font-size: 12px;
    margin-top: 4px;
}
</style>