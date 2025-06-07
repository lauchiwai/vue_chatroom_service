<template>
    <MyCard :show-border="showBorder">
        <template #content>
            <div class="stats-content">
                <div class="circle-container">
                    <div class="progress-circle" :style="{ borderColor: color }">
                        <span class="number">{{ number }}</span>
                    </div>
                </div>
                <div class="card-title">{{ title }}</div>
            </div>
        </template>
    </MyCard>
</template>

<script setup lang="ts">
import MyCard from '@/components/common/myCard.vue';

defineProps({
    number: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        default: 'title'
    },
    color: {
        type: String,
        default: '#42b883' 
    },
    showBorder: {
        type: Boolean,
        default : true
    }
})
</script>

<style scoped lang="scss">
.stats-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: 10%;
    box-sizing: border-box;
}

.card-title {
    color: #666;
    font-size: clamp(16px, 1.8vw, 20px);
    font-weight: 600;
    margin-top: 10px;
    text-align: center;
}

.circle-container {
    display: flex;
    justify-content: center;
    width: 100%;
}

.progress-circle {
    width: 60%;
    aspect-ratio: 1/1;
    max-width: 100px;
    border-radius: 50%;
    border: 3px solid;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

.number {
    font-size: clamp(18px, 2.5vw, 24px);
    font-weight: bold;
    color: #2c3e50;
}

:deep(.my-card) {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}
</style>
