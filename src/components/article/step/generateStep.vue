<template>
    <a-steps
        :responsive="false"
        :current="stepStore.currentStep - 1"
        :items="transformedSteps"
    />
</template>

<script setup lang="ts">
import type { StepProps } from 'ant-design-vue'

import { StepType } from '@/constants/steps';
import { computed, h, onMounted } from 'vue'
import { useStepStore } from '@/stores/stepStore'

const props = defineProps({
    stepType: {
        type: Object as () => StepType,
        required: true,
    }
})

onMounted(()=>{
    stepStore.reset();
    stepStore.initSteps(props.stepType)
})

const stepStore = useStepStore()
const transformedSteps = computed<StepProps[]>(() => {
    return stepStore.steps.map(step => {
        return {
            title: step.title,
            status: step.status,
            icon: h(step.icon)
        } as StepProps
    })
})
</script>
