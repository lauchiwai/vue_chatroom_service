<template>
    <MyCard :show-border="showBorder">
        <template #content>
            <div class="circle-container" >
                <div class="progress-circle" :style="{ borderColor: color }">
                    <span class="number">{{ number }}</span>
                </div>
            </div>
            <div class="card-title">{{ title }}</div>
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

<style scoped>
.card-title {
    color: #666;
    font-size: 20px;
    font-weight: 600;
    margin-top: 15px;
}

.circle-container {
    display: flex;
    justify-content: center;
    margin: 20px;
}

.progress-circle {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 4px solid;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

.number {
    font-size: 24px;
    font-weight: bold;
    color: #2c3e50;
}
</style>