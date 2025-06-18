import { RobotOutlined, FormOutlined, UploadOutlined } from '@ant-design/icons-vue';
import { h } from 'vue'

export enum StepType {
    AiGenerate = 'ai-generate',
    FileUpload = 'file-upload'
}

export interface StepConfig {
    title: string;
    icon: any;
}

export const FIRST_STEP_CONFIGS: Record<StepType, StepConfig> = {
    'ai-generate': {
        title: '輸入提示',
        icon: h(FormOutlined)
    },
    'file-upload': {
        title: '上傳檔案',
        icon: h(UploadOutlined)
    }
};

export const COMMON_STEPS: StepConfig[] = [
    { title: '生成文章', icon: RobotOutlined }
];
