<template>
    <a-modal
        :open="open"
        title="新增文章"
        :width="600"
        :footer="null"
        @cancel="closeDialog"
    >
        <form @submit.prevent="handleSubmit">
            <a-form-item
                label="文章標題"
                :validate-status="errors.title ? 'error' : ''"
                :help="errors.title"
            >
                <a-input
                    v-model:value="form.title"
                    placeholder="請輸入文章標題"
                    @input="validateTitle"
                />
            </a-form-item>

            <a-form-item
                label="文章內容"
                :validate-status="errors.content ? 'error' : ''"
                :help="errors.content"
            >
                <a-textarea
                    :value="props.initialContent"
                    placeholder="請輸入文章內容"
                    :rows="8"
                    readonly
                />
            </a-form-item>

            <div class="form-actions">
                <a-button @click="closeDialog">取消</a-button>
                <a-button
                    type="primary"
                    html-type="submit"
                    :loading="isSubmitting"
                    style="margin-left: 10px"
                >
                    {{ isSubmitting ? '新增中...' : '新增' }}
                </a-button>
            </div>
        </form>
    </a-modal>
</template>

<script setup lang="ts">
import type { articleRequest } from '@/types/article/article'

import { ROUTE_NAMES } from '@/router'
import { ref, reactive, watch } from 'vue'
import { message } from 'ant-design-vue'
import { useArticleStore } from '@/stores/articleStore'
import { useRouter } from 'vue-router'

const props = defineProps({
    open: {
        type: Boolean,
        required: true
    },
    initialContent: {
        type: String,
        required: true
    }
})

const emit = defineEmits(['update:open', 'saved'])
const router = useRouter()
const articleStore = useArticleStore()

const handelRouter = () =>{
    router.push(ROUTE_NAMES.BOOKSHELF)
}

const form = reactive({
    title: ''
})

const errors = reactive({
    title: '',
    content: ''
})

const isSubmitting = ref(false)

watch(() => props.open, (newVal) => {
    if (newVal) {
        form.title = ''
        resetErrors()
    }
})

const validateTitle = () => {
    if (!form.title.trim()) {
        errors.title = '標題不能為空'
        return false
    }
    if (form.title.length > 50) {
        errors.title = '標題不能超過50個字元'
        return false
    }
    errors.title = ''
    return true
}

const validateForm = () => {
    return validateTitle()
}

const resetErrors = () => {
    errors.title = ''
}

const closeDialog = () => {
    emit('update:open')
}

const handleSubmit = async () => {
    if (!validateForm()) return

    isSubmitting.value = true
    try {
        const request: articleRequest = {
            articleTitle: form.title,
            articleContent: props.initialContent
        }
        
        await articleStore.generateArticle(request)
        closeDialog()
        handelRouter();
        emit('saved')
    } catch (error) {
        message.error('新增失敗，請稍後再試')
    } finally {
        isSubmitting.value = false
    }
}
</script>

<style scoped>
.form-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 24px;
}

:deep(.ant-form-item-label) {
    font-weight: 500;
}
</style>
