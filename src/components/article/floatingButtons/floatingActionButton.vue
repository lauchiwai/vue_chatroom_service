<template>
    <div class="floating-actions">
        <a-float-button
            shape="square"
            type="default"
            @click="$emit('prev-page')"
            :disabled="currentPage === 0"
            class="page-button prev-button"
        >
            <template #icon><LeftOutlined /></template>
        </a-float-button>
        
        <a-float-button
            shape="square"
            type="default"
            @click="$emit('next-page')"
            :disabled="currentPage === totalPages - 1"
            class="page-button next-button"
        >
            <template #icon><RightOutlined /></template>
        </a-float-button>
        
        <a-float-button-group
            trigger="click"
            :open="expanded"
            @openChange="handleOpenChange"
            class="action-buttons"
        >
            <template #icon>
                <PlusOutlined/>
            </template>
            
            <a-float-button
                type="default"
                tooltip="返回主頁"
                @click="$emit('go-home')"
            >
                <template #icon><HomeOutlined /></template>
            </a-float-button>
            
            <a-float-button
                type="default"
                tooltip="刪除"
                @click="handleDeleteClick(), handleOpenChange(false)"
            >
                <template #icon><DeleteOutlined /></template>
            </a-float-button>
            
            <a-float-button
                type="default"
                tooltip="Rag"
                @click="handleChatOpen(), handleOpenChange(false)"
            >
                <template #icon><CommentOutlined /></template>
            </a-float-button>
            
            <a-float-button
                type="default"
                tooltip="減小字號"
                @click="$emit('adjust-font-size', -1)"
                :disabled="fontSize <= minFontSize"
            >
                <template #icon><ZoomOutOutlined /></template>
            </a-float-button>
            
            <a-float-button
                type="default"
                tooltip="增大字號"
                @click="$emit('adjust-font-size', 1)"
                :disabled="fontSize >= maxFontSize"
            >
                <template #icon><ZoomInOutlined /></template>
            </a-float-button>
            
            <a-float-button
                type="default"
                tooltip="重置字號"
                @click="$emit('reset-font-size')"
            >
                <template #icon><RestOutlined /></template>
            </a-float-button>
        </a-float-button-group>

        <RagChatModal 
            v-if="modelOpen && articleId"
            v-model:open="modelOpen"
            :articleId="articleId"
        />
        
        <DeleteModal 
            v-if="deleteModalOpen &&  articleId"
            v-model:open="deleteModalOpen"
            :deleteFn="deleteArticle"
        />
    </div>
</template>

<script setup lang="ts">
import {
    PlusOutlined,
    LeftOutlined,
    RightOutlined,
    HomeOutlined,
    ZoomInOutlined,
    ZoomOutOutlined,
    RestOutlined,
    CommentOutlined,
    DeleteOutlined 
} from '@ant-design/icons-vue'
import { ref, inject, computed } from 'vue'
import { ArticleIdKey } from '@/constants/injectionKeys'
import { useRouter } from 'vue-router'
import { ROUTE_NAMES } from '@/router';
import { message } from 'ant-design-vue'
import { useArticleStore } from '@/stores/articleStore'

import RagChatModal from '@/components/article/modals/ragChatModal.vue'
import DeleteModal from '@/components/common/modal/deleteModal.vue' 

const props = defineProps({
    currentPage: {
        type: Number,
        required: true
    },
    totalPages: {
        type: Number,
        required: true
    },
    fontSize: {
        type: Number,
        required: true
    },
    minFontSize: {
        type: Number,
        default: 12
    },
    maxFontSize: {
        type: Number,
        default: 24
    },
    showFloatButtonMenu: {
        type:Boolean,
        default:true
    }
})

const router = useRouter()
const expanded = ref(false)
const modelOpen = ref(false)
const deleteModalOpen = ref(false) 
const articleId = inject(ArticleIdKey, computed(() => 0 ))
const articleStore = useArticleStore();

const handleOpenChange = (open: boolean) => {
    expanded.value = open
}

const handleChatOpen = () => {
    if (!articleId.value){
        message.error("articleId is empty")
        return 
    }
    modelOpen.value = !modelOpen.value
}

const handleDeleteClick = () => {
    if (!articleId.value){
        message.error("articleId is empty")
        return
    }
    
    deleteModalOpen.value = true
}

const goBookShelf  = () => {
    router.push({ name: ROUTE_NAMES.BOOKSHELF })
}

const deleteArticle = async () => {
    if (!articleId.value){
        message.error("articleId is empty")
        return
    }

    try {
        const success = await articleStore.deleteArticle(articleId.value);
        goBookShelf();
        return success;
    } catch (error) {
        message.error('刪除文章時發生錯誤');
        console.error('刪除文章失敗:', error);
        return false;
    }
};
</script>

<style scoped lang="scss">
.floating-actions {
    position: relative;
}

.page-button {
    position: fixed;
    bottom: 80px;
    height: 40px;
    width: 40px;
    z-index: 101;
    background-color: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;
    border: 1px solid #d9d9d9;
}

.page-button:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.page-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: #f5f5f5;
    box-shadow: none;
}

.page-button:disabled:hover {
    transform: none;
}

.prev-button {
    right: 110px;
}

.next-button {
    right: 60px;
}

.action-buttons {
    position: fixed;
    right: 10px;
    bottom: 75px;
    z-index: 101;
}

.action-buttons :deep(.ant-float-btn-group) {
    display: flex;
    flex-direction: column-reverse;
    position: absolute;
    bottom: 100%;
    right: 0;
    margin-bottom: 8px;
}

.action-buttons :deep(.ant-float-btn) {
    margin-bottom: 4px;
    height: 40px;
    width: 40px;
    background-color: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    transition: all 0.2s ease;
    border: 1px solid #f0f0f0;
}

.action-buttons :deep(.ant-float-btn):hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
    .page-button {
        bottom: 72px;
        height: 36px;
        width: 36px;
    }
    
    .prev-button {
        right: 100px;
    }
    
    .next-button {
        right: 55px;
    }
    
    .action-buttons {
        bottom: 70px;
        right: 8px;
    }
    
    .action-buttons :deep(.ant-float-btn) {
        height: 36px;
        width: 36px;
    }
}

@media (max-width: 480px) {
    .page-button {
        bottom: 73px;
        height: 32px;
        width: 34px;
    }
    
    .prev-button {
        right: 95px;
    }
    
    .next-button {
        right: 55px;
    }
}
</style>
