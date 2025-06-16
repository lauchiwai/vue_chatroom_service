<template>
    <DraggableResizableModal 
        v-if="open"
        v-model:open="open"
        :css-style="modalStyle"
        :autoSize="false"
        :contentPadding="'10px'"
    >
        <template #modal-title-left>
            <div class="chat-header" v-if="dataExist">
                <chatHeader />
            </div>
        </template>

        <template #contents>
            <template v-if="!dataExist">
                <VectorizationStatusChecker 
                    v-if="!isVectorizing"
                    :dataExist="dataExist"
                    :isChecking="isChecking"
                    @start-vectorization="startVectorization"
                />
              
                <VectorizationInProgress 
                    v-else
                    :progressPercent="progressPercent"
                    :articleId="articleId ?? -1"
                />
            </template>

            <div class="chatroom-container" v-else>
                <div class="msg-container">
                    <messageList />
                </div>
                <div class="input-container">
                    <chatInput />
                </div>
            </div>
        </template>
    </DraggableResizableModal>
</template>

<script setup lang="ts">
import type { checkVectorDataExistRequest } from '@/types/vector/vector'
import { DEFAULTCOLLECTION, type vectorizeArticleRequest } from "@/types/article/article"

import { useScreenStore } from '@/stores/screenStore'
import { useArticleStore } from '@/stores/articleStore'
import { useVectorStore } from '@/stores/vectorStore'
import { message } from 'ant-design-vue'
import { ref, inject, watch, computed, onMounted } from 'vue'
import { ArticleIdKey } from '@/constants/injectionKeys'
import { useChatStore } from '@/stores/chatStore';

import messageList from '@/components/article/chatroom/ragMessageList.vue'
import chatInput from '@/components/article/chatroom/ragChatInput.vue'
import chatHeader from '@/components/article/chatroom/ragChatHeader.vue'
import DraggableResizableModal from '@/components/common/modal/draggableResizableModal.vue'
import VectorizationStatusChecker from '@/components/article/vectorization/vectorizationStatusChecker.vue'
import VectorizationInProgress from '@/components/article/vectorization/vectorizationInProgress.vue'

const articleId = inject(ArticleIdKey, computed(() => 0 ))
watch(articleId, ( newId: number | undefined ) => {
    if (!newId)
        console.log('articleId is undefine:')
})

const chatStore = useChatStore();
const open = defineModel('open', { type: Boolean, required: true })
const screenStore = useScreenStore()
const articleStore = useArticleStore()
const vectorStore = useVectorStore()

const isMobile = computed(() => screenStore.isMobile)
const isPad = computed(() => screenStore.isPad)
const isPc = computed(() => screenStore.isPc)

const dataExist = ref(false)
const isChecking = ref(true)
const isVectorizing = ref(false)
const progressPercent = ref(0)
const progressInterval = ref<any>()

const modalStyle = computed(() => {
    if (isMobile.value) {
        return {
            height: '80vh',
            width: '100vw',
            top: '5vh'
        }
    } else if (isPad.value) {
        return {
            height: '80vh',
            width: '95vw',
            top: '5vh'
        }
    } else {
        return {
            height: '70vh',
            width: '600px',
            top: '5vh'
        }
    }
})

onMounted(async () => {    
    if (articleId.value) {
        await checkDataExist()
    }
})

watch((dataExist), async(newVal)=>{
    if (newVal) {
        await chatStore.fetchRagChatSessionListByArticleId(articleId.value ?? -1);
    }
})

const checkDataExist = async () => {
    try {
        isChecking.value = true
        const request: checkVectorDataExistRequest = {
            collection_name: DEFAULTCOLLECTION,
            id: articleId.value ?? -1
        }
        dataExist.value = await vectorStore.checkVectorDataExist(request)
    } catch (error) {
        message.error('檢查向量資料失敗')
        console.error('Vector data check error:', error)
    } finally {
        isChecking.value = false
    }
}

const startVectorization = async () => {
    if (!articleId.value) return
  
    isVectorizing.value = true
    startProgressSimulation()
  
    try {
        const request: vectorizeArticleRequest = {
            collectionName: DEFAULTCOLLECTION,
            articleId: articleId.value
        }
        await articleStore.vectorizeArticle(request)
        message.success('向量化處理完成')
        dataExist.value = true
    } catch (error) {
        message.error('向量化處理失敗')
        console.error('Vectorization error:', error)
    } finally {
        clearInterval(progressInterval.value)
        progressPercent.value = 100
        setTimeout(() => {
            isVectorizing.value = false
        }, 1500)
    }
}

const startProgressSimulation = () => {
    progressPercent.value = 0
    progressInterval.value = setInterval(() => {
        if (progressPercent.value < 90) {
            progressPercent.value += Math.floor(Math.random() * 10) + 1
        }
    }, 800)
}
</script>

<style lang="scss" scoped>

.chat-header {
    height: 30px;
    flex-shrink: 0;
}

.chatroom-container {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;

    .msg-container {
        flex: 1 1 auto; 
        min-height: 0;
        padding-bottom: 10px;
        scroll-behavior: smooth;
        overflow: auto;
        position: relative;

        &::-webkit-scrollbar {
            width: 8px;
        }
        &::-webkit-scrollbar-thumb {
            background-color: #c1c1c1;
            border-radius: 4px;
        }
    }

    .input-container {
        width: 100%;
        flex-shrink: 0;
    }
}

@media (max-width: 767px) {
    .chatroom-container {
        height: 70vh !important;
    }
}

@media (min-width: 768px) and (max-width: 1024px) {
    .chatroom-container {
        height: 70vh !important;
    }
}

@media (min-width: 1025px) {
    .chatroom-container {
        
        .msg-container {
            max-height: calc(70vh - 120px); 
        }
    }
}
</style>
