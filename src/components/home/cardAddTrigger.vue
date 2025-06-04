<template>
    <div class="card-add-trigger-container" >
        <MyCard :show-border="true" @click="handelClick"> 
            <template #content>
                <div class="plus-icon">
                    <PlusOutlined />
                </div>
            </template>
        </MyCard>
    </div>
</template>

<script setup lang="ts">
import { PlusOutlined } from '@ant-design/icons-vue'
import MyCard from '@/components/common/myCard.vue';

const emit = defineEmits(['click-event'])
const handelClick = () =>{
    emit('click-event')
}
</script>

<style scoped lang="scss">
.card-add-trigger-container{
    height: 100%;
    width: 100%;
    border-radius: 20px;
    .plus-icon{
        color: gray;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }  
}

.card-add-trigger-container:hover{
    .plus-icon{
        transform: scale(1.4);
    }
}

.plus-icon{
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 50px;
    height: 120px;
    cursor: pointer;
    margin: 20px;
}
</style>