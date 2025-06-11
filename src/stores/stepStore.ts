import type { StepProps } from 'ant-design-vue';
import { defineStore } from 'pinia';
import { RobotOutlined, FormOutlined } from '@ant-design/icons-vue';

export interface StepItem {
    title: string;
    status: StepProps['status'];
    icon: any;
}

export const useStepStore = defineStore('step', {
    state: () => ({
        currentStep: 1 as number,
        steps: [
            {
                title: '輸入提示',
                status: 'process' as StepProps['status'],
                icon: FormOutlined
            },
            {
                title: '生成文章',
                status: 'wait' as StepProps['status'],
                icon: RobotOutlined
            }
        ] as StepItem[]
    }),
    actions: {
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
