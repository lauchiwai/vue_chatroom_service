<template>
    <div class="not-found-container">
        <a-result status="404" title="404" sub-title="抱歉，您訪問的頁面不存在">
            <template #extra>
                <a-button type="primary" @click="goHome">返回首頁</a-button>
            </template>
        </a-result>
    </div>
</template>
  
<script lang="ts" setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const goHome = () => {
    router.push('/Home') 
}
</script>
  
<style scoped>
.not-found-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}
</style>