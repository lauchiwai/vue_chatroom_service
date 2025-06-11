<template> 
    <DraggableResizableModal 
        v-if="open"
        v-model:open="open"
        :mask="isMobile"
        :css-style="{top:'5vh'}"
        :enable-resize="!isMobile"
        :enable-draggable="!isMobile"
    >
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
                <div class="chat-header">
                    <chatHeader />
                </div>
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

import messageList from '@/components/chatroom/messageList.vue'
import chatInput from '@/components/chatroom/chatInput.vue'
import chatHeader from '@/components/chatroom/chatHeader.vue'
import DraggableResizableModal from '@/components/common/draggableResizableModal.vue'
import VectorizationStatusChecker from '@/components/article/vectorizationStatusChecker.vue'
import VectorizationInProgress from '@/components/article/vectorizationInProgress.vue'

const articleId = inject(ArticleIdKey, computed(() => 0 ))
watch(articleId, ( newId: number | undefined ) => {
    if (!newId)
        console.log('articleId is undefine:')
})

const chatStore = useChatStore();
const open = defineModel('open', { type: Boolean, required: true })
const store = useScreenStore()
const articleStore = useArticleStore()
const vectorStore = useVectorStore()

const isMobile = computed(() => store.isMobile)
const dataExist = ref(false)
const isChecking = ref(true)
const isVectorizing = ref(false)
const progressPercent = ref(0)
const progressInterval = ref<any>()
onMounted(async () => {
    if (articleId.value) {
        await checkDataExist()
    }
})

watch((dataExist), async(newVal, oldVal)=>{
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
.chatroom-container {
    height: 70vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    position: relative;

    .chat-header {
        height: 40px;
        flex-shrink: 0;
    }

    .msg-container {
        flex: 1;
        padding: 10px 10%;
        scroll-behavior: smooth;
        overflow: auto;
    }

    .input-container{
        width: 100%;
    }
}

@media (max-width: 768px) {
    .chatroom-container {
        height: 70vh !important;
        .msg-container {
            padding: 10px 5%;
        }
    }
}
</style>
