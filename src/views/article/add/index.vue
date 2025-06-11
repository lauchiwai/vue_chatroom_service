<template>
    <div class="article-generate-container center-box">
        <div class="generate-step-wrapper">
            <div class="sub-generate-step-wrapper"> 
                <GenerateStep :steps="stepStore.steps" />
            </div>
        </div>

        <div class="main-content-wrapper">
            <div class="article-prompt-wrapper" v-if="currentStep == 1">
                <TipsPrompt />
                <ArticlePromptInput @generate="handleSteamGenerate" />
            </div>

            <div class="article-reader-wrapper" v-if="currentStep == 2">
                <ArticleReader 
                    :content="assistantMessage"
                    :show-float-button-menu="false"
                />
            </div>
        </div>

        <div class="step-controls">
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
        </div>
    </div>

    <ArticleSaveModal 
        v-if="modalOpen"
        :open="modalOpen"
        :initial-content="assistantMessage"
        @update:open="handleModal"
        @saved="handleArticleSaved"
    />
</template>

<script lang="ts" setup>
import { useArticleStore } from '@/stores/articleStore';
import { useStepStore } from '@/stores/stepStore';
import { storeToRefs } from 'pinia';
import { ref, onMounted, onUnmounted } from 'vue';
import { message } from 'ant-design-vue';

import ArticlePromptInput from '@/components/article/articlePromptInput.vue';
import GenerateStep from '@/components/article/step/generateStep.vue';
import TipsPrompt from '@/components/article/prompt/tipsPrompt.vue';
import ArticleReader from '@/components/article/articleReader.vue';
import ArticleSaveModal from '@/components/article/modals/articleSaveModal.vue';

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

<style scoped lang="scss">
.center-box {
    display: flex;
    align-items: center;
    justify-content: center;
}

.article-generate-container {
    flex-direction: column;
    height: 100%;
    width: 100%;
    overflow: hidden;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    position: relative;
    padding: 6px;
    transition: all 0.3s ease;

    .generate-step-wrapper {
        flex: 0 0 auto;
        height: 45px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: 1px solid #eee;
        background-color: #f8f9fa;
        
        .sub-generate-step-wrapper {
            width: 80%;
            padding: 12px 0;
        }
    }

    .main-content-wrapper {
        flex: 1 1 auto;
        min-height: 0;
        width: 100%;
        overflow: auto;
        background-color: #ffffff;
        padding: 5px 0;
        transition: background-color 0.3s;

        .article-prompt-wrapper,
        .article-reader-wrapper {
            width: 100%;
            display: flex;
            height: 100%;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }

        .article-prompt-wrapper {
            flex-direction: column;
            gap: 24px;
            
            > *:first-child {
                flex: 0 0 auto;
            }
            
            > *:last-child {
                flex: 1 1 auto;
                min-height: 0;
            }
        }

        .article-reader-wrapper {
            overflow-y: auto;
            scroll-behavior: smooth;
            padding: 20px;
            box-sizing: border-box;
            background-color: #f9f9f9;
            border-radius: 8px;
            box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.05);
            
            &::-webkit-scrollbar {
                width: 6px;
            }
            
            &::-webkit-scrollbar-thumb {
                background-color: rgba(0, 0, 0, 0.2);
                border-radius: 3px;
            }
        }
    }

    .step-controls {
        flex: 0 0 auto;
        width: 100%;
        padding: 10px;
        display: flex;
        justify-content: center;
        gap: 16px;
        border-top: 1px solid #eee;
        background-color: #fff;
        position: sticky;
        bottom: 0;
        z-index: 100;
        box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);

        .control-button {
            min-width: 140px;
            height: 44px;
            font-size: 16px;
            border-radius: 8px;
            transition: all 0.3s;
            font-weight: 500;
            
            &:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
        }

        .generate-button {
            border-color: transparent;
        }
    }
}

@media (max-width: 1024px) {
    .article-generate-container {
        .main-content-wrapper {
            padding: 15px 0;
            
            .article-prompt-wrapper,
            .article-reader-wrapper {
                padding: 0 15px;
            }
        }
        
        .generate-step-wrapper {
            min-height: 70px;
            
            .sub-generate-step-wrapper {
                width: 90%;
            }
        }
    }
}

@media (max-width: 768px) {
    .article-generate-container {
        border-radius: 0;
        
        .main-content-wrapper {
            .article-prompt-wrapper,
            .article-reader-wrapper {
                padding: 0 12px;
            }
            
            .article-reader-wrapper {
                padding: 12px;
            }
        }
        
        .step-controls {
            padding: 16px;
            gap: 12px;
            flex-wrap: wrap;
            
            .control-button {
                min-width: 120px;
                height: 40px;
                font-size: 14px;
                flex: 1;
            }
        }
    }
}

@media (max-width: 480px) {
    .article-generate-container {
        .generate-step-wrapper {
            min-height: 60px;
            
            .sub-generate-step-wrapper {
                width: 95%;
                padding: 8px 0;
            }
        }
        
        .main-content-wrapper {
            padding: 10px 0;
            
            .article-prompt-wrapper {
                gap: 16px;
            }
            
            .article-reader-wrapper {
                padding: 8px;
            }
        }
        
        .step-controls {
            padding: 12px;
            gap: 8px;
            
            .control-button {
                min-width: 100px;
                height: 38px;
                font-size: 13px;
            }
        }
    }
}
</style>
