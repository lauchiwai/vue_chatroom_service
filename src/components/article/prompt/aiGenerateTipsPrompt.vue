<template>
    <div class="tips-prompt-container">
        <div class="tips-icon">
            <RobotOutlined />
        </div>
        <div class="tips-conten"> 
            <span>文章生成器</span>
            <span>輸入您的創意提示詞, 我將為您生成高質量的文章內容</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { RobotOutlined } from '@ant-design/icons-vue'

</script>

<style scoped lang="scss">
.tips-prompt-container{
    .tips-icon{
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 40px;
        color: gray;
    }

    .tips-conten{
        margin-top: 10px;
        display: flex;
        justify-content: center;
        flex-direction: column;
        padding: 0 10px;

        span{
            margin: 4px auto;
            font-size: 18px;
        }
    }
}
</style>
