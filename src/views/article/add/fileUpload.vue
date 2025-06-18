<template>
    <ArticleGenerateLayout>
        <template #step>
            <div class="sub-generate-step-wrapper">
                <GenerateStep :step-type="StepType.FileUpload" />
            </div>
        </template>

        <template #main>
            <div class="main-content-wrapper">
                <div class="article-prompt-wrapper" v-if="currentStep == 1">
                    <FileUploader 
                        @file-uploaded="handleFileUploaded"
                        :supportedFormats="'.doc,.docx,.txt'"
                        :uploadText="'點擊或拖拽文件到這裡上傳'"
                        :hintText="'支持格式：DOC, DOCX, TXT'"
                        :sizeText="'最大文件大小：10MB'"
                        :disabled="uploading"
                    />
                    
                    <div class="progress-container" v-if="uploading">
                        <a-progress 
                            type="circle" 
                            :percent="progressPercent" 
                            :width="80"
                            :status="progressStatus"
                        />
                        <div class="progress-text">{{ progressText }}</div>
                    </div>
                </div>

                <div class="article-reader-wrapper" v-if="currentStep == 2">
                    <ArticleReader
                        :content="articleContent"
                        :show-float-button-menu="false"
                    />
                </div>
            </div>
        </template>

        <template #controls>
            <template v-if="currentStep === 2">
                <a-button 
                    @click="handleFileReset"
                    :loading="generating"
                    class="control-button"
                >
                    重新上傳
                </a-button>

                <a-button
                    type="primary"
                    @click="handleModal"
                    class="control-button"
                >
                    儲存文章
                </a-button>
            </template>
        </template>
    </ArticleGenerateLayout>

    <ArticleSaveModal
        v-if="modalOpen"
        :open="modalOpen"
        :initial-content="articleContent"
        @update:open="handleModal"
        @saved="handleArticleSaved"
    />
</template>

<script lang="ts" setup>
import type { Progress } from 'ant-design-vue';
import { ref, onMounted } from "vue";
import { StepType } from "@/constants/steps";
import { useArticleStore } from "@/stores/articleStore";
import { useStepStore } from "@/stores/stepStore";
import { storeToRefs } from "pinia";
import { message } from "ant-design-vue";
import * as mammoth from 'mammoth'; 
import ArticleGenerateLayout from "@/components/article/layout/articleGenerateLayout.vue";
import GenerateStep from "@/components/article/step/generateStep.vue";
import ArticleReader from "@/components/article/view/articleReader.vue";
import ArticleSaveModal from "@/components/article/modals/articleSaveModal.vue";
import FileUploader from "@/components/article/add/articleFileUploadButton.vue";

const stepStore = useStepStore();
const articleStore = useArticleStore();
const { currentStep } = storeToRefs(stepStore);

const generating = ref(false);
const modalOpen = ref(false);
const fileContent = ref<string | null>(null);
const articleContent = ref('');
const uploading = ref(false);
const progressPercent = ref(0);
const progressStatus = ref<typeof Progress['status']>('active');
const progressText = ref('');

const handleFileReset = () =>{
    stepStore.prevStep();
    fileContent.value = null
    progressText.value = ''
}

const handleFileUploaded = async (content: string | ArrayBuffer | null) => {
    if (content === null) {
        message.error("文件内容为空");
        return;
    }
    
    uploading.value = true;
    progressPercent.value = 30;
    progressText.value = "解析文件中...";
    
    try {
        const progressInterval = setInterval(() => {
            if (progressPercent.value < 80) {
                progressPercent.value += 10;
            }
        }, 300);
        
        if (content instanceof ArrayBuffer) {
            const result = await mammoth.extractRawText({ arrayBuffer: content });
            fileContent.value = result.value;
            articleContent.value = result.value; 
        } else {
            fileContent.value = content;
            articleContent.value = content; 
        }
        
        clearInterval(progressInterval);
        progressPercent.value = 100;
        progressStatus.value = 'success';
        progressText.value = "解析完成！";
        
        setTimeout(() => {
            uploading.value = false;
            stepStore.setCurrentStep(2);
            message.success("文件解析成功");
        }, 800);
        
    } catch (error) {
        console.error("文件解析失败:", error);
        progressStatus.value = 'exception';
        progressText.value = "解析失败";
        message.error("文件解析失败，请重试");
        
        setTimeout(() => {
            uploading.value = false;
            progressPercent.value = 0;
            progressStatus.value = 'active';
        }, 1500);
    }
};

const resetAllState = () => {
    stepStore.reset();
    articleStore.reset();
    generating.value = false;
    modalOpen.value = false;
    fileContent.value = null;
    articleContent.value = '';
    uploading.value = false;
    progressPercent.value = 0;
    progressStatus.value = 'active';
};

const handleArticleSaved = () => {
    message.success("文章保存成功");
    resetAllState();
};

const handleModal = () => {
    modalOpen.value = !modalOpen.value;
};

onMounted(() => {
    resetAllState();
});
</script>

<style scoped lang="scss">
.main-content-wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
}

.article-prompt-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    width: 100%;
    position: relative;
}

.article-reader-wrapper {
    flex: 1;
    overflow: auto;
    width: 100%;
}

.upload-section {
    height: 100%;
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
}

.generate-button {
    margin-top: 20px;
}

.control-button {
    margin-right: 10px;
}

.progress-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: rgba(255, 255, 255, 0.9);
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.progress-text {
    margin-top: 12px;
    font-size: 14px;
    color: #333;
    font-weight: 500;
}
</style>
