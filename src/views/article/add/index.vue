<template>
    <div class="article-generate-container center-box">
        <div class="generate-step-wrapper">
            <div class="sub-generate-step-wrapper"> 
                <GenerateStep/>
            </div>
        </div>

        <div class="main-content-wrapper">
            <div class="article-prompt-wrapper" v-if="currentStep == 1">
                <TipsPrompt />
                <ArticlePromptInput @generate="handleSteamGenerate" />
            </div>

            <div class="article-reader-wrapper" v-if="currentStep == 2">
                <ArticleReader 
                    :page-char-count="700"
                    :content="assistantMessage"
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
                上一頁
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
        @update:open="handleModal"
        :open="modalOpen"
        :initial-content="assistantMessage"
        
    />
</template>

<script lang="ts" setup>
import { useArticleStore } from '@/stores/articleStore'
import { useStepStore } from '@/stores/stepStore'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { message } from 'ant-design-vue'

import ArticlePromptInput from '@/components/article/articlePromptInput.vue'
import GenerateStep from '@/components/article/generateStep.vue'
import TipsPrompt from '@/components/article/tipsPrompt.vue'
import ArticleReader from '@/components/article/articleReader.vue'
import ArticleSaveModal from '@/components/article/modals/articleSaveModal.vue'

const stepStore = useStepStore();
const articleStore = useArticleStore();
const { assistantMessage } = storeToRefs(articleStore)
const { currentStep } = storeToRefs(stepStore)
const generating = ref(false)
const modalOpen = ref(false)

const handleModal = () =>{
    modalOpen.value = !modalOpen.value
}

const handleSteamGenerate = async () => {
    if (!articleStore.prompt.trim()) {
        message.warning('請輸入提示詞')
        return
    }
    
    generating.value = true
    try {
        stepStore.nextStep()
        await articleStore.streamGenerate({
            prompt: articleStore.prompt
        });
    } catch (error) {
        stepStore.prevStep()
        message.error('文章創建失敗')
    } finally {
        generating.value = false
    }
}

const handleRegenerate = () => {
    articleStore.abortStreaming();
    articleStore.resetAssistantMessage();
    stepStore.prevStep();
}
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

    .generate-step-wrapper {
        flex: 0 0 auto;
        min-height: 80px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: 1px solid #eee;
        .sub-generate-step-wrapper{
            width: 80%;
        }
    }

    .main-content-wrapper {
        flex: 1 1 auto;
        min-height: 0;
        width: 100%;
        overflow: auto;

        .article-prompt-wrapper,
        .article-reader-wrapper {
            width: 100%;
            display: flex;
            height: 100%;
        }

        .article-prompt-wrapper {
            flex-direction: column;
            padding: 20px;
            box-sizing: border-box;
            gap: 20px;
            
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
            -webkit-overflow-scrolling: touch;
            scroll-behavior: smooth;
            padding: 20px;
            box-sizing: border-box;
            background-color: #f9f9f9;
            
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
        padding: 20px;
        display: flex;
        justify-content: center;
        gap: 16px;
        border-top: 1px solid #eee;
        background-color: #fff;
        position: sticky;
        bottom: 0;
        z-index: 100;

        .control-button {
            min-width: 120px;
            height: 40px;
            font-size: 16px;
            border-radius: 8px;
            transition: all 0.3s;
            
            &:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
        }
    }
}

@media (max-width: 1024px) {
    .article-generate-container {
        .main-content-wrapper {
            padding: 15px;
        }
        
        .generate-step-wrapper {
            min-height: 60px;
            padding: 0 15px;
        }
    }
}

@media (max-width: 768px) {
    .article-generate-container {
        border-radius: 0;
        
        .main-content-wrapper {
            .article-prompt-wrapper,
            .article-reader-wrapper {
                padding: 12px;
            }
        }
        
        .step-controls {
            padding: 12px;
            gap: 8px;
            
            .control-button {
                min-width: auto;
                width: 100%;
                font-size: 14px;
            }
        }
    }
}

@media (max-width: 480px) {
    .article-generate-container {
        .generate-step-wrapper {
            min-height: 50px;
        }
        
        .main-content-wrapper {
            padding: 10px;
            
            .article-prompt-wrapper {
                gap: 12px;
            }
        }
    }
}
</style>
