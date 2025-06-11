<template>
    <div class="card-add-trigger-container">
        <MyCard :show-border="true" @click="handelClick"> 
            <template #content>
                <div class="plus-icon-container">
                    <PlusOutlined class="plus-icon" />
                </div>
            </template>
        </MyCard>
    </div>
</template>

<script setup lang="ts">
import { PlusOutlined } from '@ant-design/icons-vue'
import MyCard from '@/components/common/myCard.vue';

const emit = defineEmits(['click-event'])
const handelClick = () => {
    emit('click-event')
}
</script>

<style scoped lang="scss">
.card-add-trigger-container {
    width: 100%;
    height: 100%;
    border-radius: 12px;
    overflow: hidden;

    &:hover {
        cursor: pointer;
    }

    .plus-icon-container {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        padding: 15%;
        box-sizing: border-box;
    }
    
    .plus-icon {
        color: #aaa;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        font-size: 100px; 
        display: flex;
        justify-content: center;
        align-items: center;
    }
}

.card-add-trigger-container:hover {
    .plus-icon {
        transform: scale(1.2);
        color: #1890ff;
    }
}
</style>
