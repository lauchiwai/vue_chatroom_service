<template>
    <div class="statistic-container">
        <StatisticCard />
    </div>
    <div class="aichat-container">
        <StatisticCard />
    </div>
</template>

<script lang="ts"setup>
import StatisticCard from '@/components/home/statisticCard.vue'
</script>

<style scoped lang="scss">
.statistic-container{
    padding: 10px;
}

.aichat-container{
    padding:10px
}
</style>