<template>
    <a-layout-header class="header">
        <div class="header-left">
            <span class="header-title">
                {{ title }} 
            </span>
        </div>

        <div class="header-right">
        </div>
    </a-layout-header>
</template>

<script setup lang="ts">
defineProps<{
    title: string
}>()
</script>

<style lang="scss" scoped>
.header {
    background: transparent;
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .header-left{
        height: 100%;
        display: flex;
        align-items: center;

        .header-title{
            font-size: 20px;
            font-weight: 600;
            padding: 0 20px;
        }
    }

    .header-right {
        display: flex;
        gap: 16px;
    }
}
</style>
