import type { StepProps } from 'ant-design-vue';

import { StepType } from '@/constants/steps';
import { FIRST_STEP_CONFIGS, COMMON_STEPS } from '@/constants/steps';
import { defineStore } from 'pinia';

export interface StepItem {
    title: string;
    status: StepProps['status'];
    icon: any;
}

export const useStepStore = defineStore('step', {
    state: () => ({
        currentStep: 1,
        steps: [] as StepItem[]
    }),
    actions: {
        createSteps(type: StepType) {
            const firstStep = {
                ...FIRST_STEP_CONFIGS[type],
                status: 'process' as StepProps['status']
            };
            const commonSteps = COMMON_STEPS.map(step => ({
                ...step,
                status: 'wait' as StepProps['status']
            }));
            return [firstStep, ...commonSteps];
        },
        initSteps(type: StepType) {
            this.steps = this.createSteps(type);
            this.currentStep = 1;
        },
        setCurrentStep(step: number) {
            this.currentStep = step;
            this.steps.forEach((item, index) => {
                if (index < step - 1) {
                    item.status = 'finish';
                } else if (index === step - 1) {
                    item.status = 'process';
                } else {
                    item.status = 'wait';
                }
            });
        },
        nextStep() {
            if (this.currentStep < this.steps.length) {
                this.setCurrentStep(this.currentStep + 1);
            }
        },
        prevStep() {
            if (this.currentStep > 1) {
                this.setCurrentStep(this.currentStep - 1);
            }
        },
        reset() {
            this.currentStep = 1;
            this.steps.forEach((item, index) => {
                if (index === 0) {
                    item.status = 'process';
                } else {
                    item.status = 'wait';
                }
            });
        }
    }
});
