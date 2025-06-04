<template>
    <a-steps
        :responsive="false"
        :current="stepStore.currentStep - 1"
        :items="transformedSteps"
    />
</template>

<script setup lang="ts">
import type { StepProps } from 'ant-design-vue'
import { computed, h } from 'vue'
import { useStepStore } from '@/stores/stepStore'

const stepStore = useStepStore()
const transformedSteps = computed<StepProps[]>(() => {
    return stepStore.steps.map(step => {
        return {
            title: step.title,
            status: step.status,
            icon: h(step.icon)
        }
    })
})
</script>