<template>
    <div class="ant-menu">
        <div v-for="item in items"
            :key="item.key"
            class="ant-menu-item"
            :class="selectedKeys.includes(item.key) ? 'active' : ''"
            @click="handleClick(item)"
        >
            <span class="ant-menu-item-icon">
                <component :is="item.icon" v-if="item.icon" />
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { MenuItem } from '@/stores/siderStore'
import { ref } from 'vue'

const props = defineProps({
    items: {
        type: Array as () => MenuItem[],
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

<style scoped lang="scss">
.ant-menu {
    --ant-color-primary: #1677ff;
    --ant-color-bg-hover: rgba(0, 0, 0, 0.06);
    --ant-border-color: #f0f0f0;
    --ant-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    background: #fff;
    border-right: 1px solid var(--ant-border-color);
    padding: 8px 0;
    transition: all 0.2s ease;
}

.ant-menu-item {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 60px;
    cursor: pointer;
    border-radius: 6px;
    transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    color: rgba(0, 0, 0, 0.88);
    margin: 0 8px;
    padding: 0 12px;

    &:hover {
        background: var(--ant-color-bg-hover);

        .ant-menu-hover-label {
        opacity: 1;
        visibility: visible;
        transform: translateX(0);
        }
    }

    &.active {
        background: #e6f4ff;
        color: var(--ant-color-primary);
        font-weight: 500;
    }
}

.ant-menu-item-icon {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 18px;
    position: relative;

    svg {
        width: 1em;
        height: 1em;
        flex-shrink: 0;
    }
}
</style>