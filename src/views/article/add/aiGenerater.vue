<template>
    <ArticleGenerateLayout>
        <template #step>
            <div class="sub-generate-step-wrapper"> 
                <GenerateStep :step-type="StepType.AiGenerate" />
            </div>
        </template>

        <template #main>
            <div class="article-prompt-wrapper" v-if="currentStep == 1">
                <AiGenerateTipsPrompt />
                <ArticlePromptInput @generate="handleSteamGenerate" />
            </div>

            <div class="article-reader-wrapper" v-if="currentStep == 2">
                <ArticleReader 
                    :content="assistantMessage"
                    :show-float-button-menu="false"
                />
            </div>
        </template>

        <template #controls>
            <a-button 
                v-if="currentStep === 1"
                type="primary"
                @click="handleSteamGenerate"
                :disabled="!articleStore.prompt.trim()"
                :loading="generating"
                class="control-button generate-button"
            >
                生成文章
            </a-button>

            <a-button 
                v-if="currentStep === 2"
                @click="handleRegenerate"
                class="control-button"
            >
                重新生成
            </a-button>
            
            <a-button 
                v-if="currentStep === 2"
                type="primary"
                @click="handleModal"
                :loading="generating"
                class="control-button"
            >
                {{ generating ? '生成中' : '儲存文章' }}
            </a-button>
        </template>
    </ArticleGenerateLayout>

    <ArticleSaveModal 
        v-if="modalOpen"
        :open="modalOpen"
        :initial-content="assistantMessage"
        @update:open="handleModal"
        @saved="handleArticleSaved"
    />
</template>

<script lang="ts" setup>
import { StepType } from '@/constants/steps';
import { useArticleStore } from '@/stores/articleStore';
import { useStepStore } from '@/stores/stepStore';
import { storeToRefs } from 'pinia';
import { ref, onMounted, onUnmounted } from 'vue';
import { message } from 'ant-design-vue';

import ArticleGenerateLayout from '@/components/article/layout/articleGenerateLayout.vue';
import ArticlePromptInput from '@/components/article/add/articlePromptInput.vue';
import GenerateStep from '@/components/article/step/generateStep.vue';
import ArticleReader from '@/components/article/view/articleReader.vue';
import ArticleSaveModal from '@/components/article/modals/articleSaveModal.vue';
import AiGenerateTipsPrompt from '@/components/article/prompt/aiGenerateTipsPrompt.vue'

const stepStore = useStepStore();
const articleStore = useArticleStore();
const { assistantMessage } = storeToRefs(articleStore);
const { currentStep } = storeToRefs(stepStore);

const generating = ref(false);
const modalOpen = ref(false);

const resetAllState = () => {
    stepStore.reset();
    articleStore.reset();
    generating.value = false;
    modalOpen.value = false;
};

const handleArticleSaved = () => {
    message.success('文章保存成功');
    resetAllState();
};

const handleModal = () => {
    modalOpen.value = !modalOpen.value;
};

const handleSteamGenerate = async () => {
    if (!articleStore.prompt.trim()) {
        message.warning('請輸入提示詞');
        return;
    }
    
    generating.value = true;
    try {
        stepStore.nextStep();
        await articleStore.streamGenerate({
            prompt: articleStore.prompt
        });
    } catch (error) {
        stepStore.prevStep();
        message.error('文章創建失敗');
    } finally {
        generating.value = false;
    }
};

const handleRegenerate = () => {
    articleStore.abortStreaming();
    articleStore.resetAssistantMessage();
    stepStore.prevStep();
};

onMounted(() => {
    resetAllState();
});

onUnmounted(() => {
    articleStore.abortStreaming();
});
</script>
