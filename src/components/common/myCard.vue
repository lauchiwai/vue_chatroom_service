<template>
    <div class="stats-card" :class="showBorder ? 'stats-card-border' : ''">
        <slot name=content></slot>
    </div>
</template>

<script setup lang="ts">
defineProps({
    showBorder: {
        type: Boolean,
        default : true
    }
})
</script>

<style scoped>
.stats-card {
    background-color: transparent;
    background-clip: padding-box;
    overflow: hidden;
    border-radius: 12px;
    height: 100%;
    width: 100%;
    text-align: center;
}

.stats-card-border{
    border: 2px solid #E0E0E0;
}
</style>