<template>
    <div class="menu-container">
        <a-menu 
            class="custom-menu"
            theme="light"
            mode="inline"
            :selected-keys="selectedKeys"
        >   
            <a-menu-item 
                v-for="item in items"
                @click="emitMenuSelect(item)"
            >
                <div class="menu-item-container">
                    <slot name="item-name" :item="item">
                    </slot>
                    
                    <div class="menu-item-btn-wrapper">
                        <slot name="item-actions" :item="item">
                        </slot>
                    </div>
                </div>
            </a-menu-item>
        </a-menu>
    </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
    items: {
        type: Array,
        required: true,
        default: () => []
    },
    selectedKeys: {
        type: Array,
        default: () => []
    }
})

const emit = defineEmits(['select'])

const emitMenuSelect = (info: any) => {
    emit('select', info)
}
</script>

<style lang="scss" scoped>
.menu-container{
    height: 100%;

    :deep(.custom-menu) {
        height: 100%;
        display: flex;
        flex-direction: column;
        min-height: 0; 
        overflow-y: auto; 

        .ant-menu-item{
            min-height: 55px; 
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            
            .menu-item-container{
                position: relative;
                height: 100%;
                width: 100%;
                padding: 0 16px;
                display: flex;
                align-items: center;
            }

            .menu-item-btn-wrapper{
                position: absolute;
                display: flex;
                align-items: center;
                justify-content: center;
                top: 0;
                right: 0;
                display: none;
                height: 100%;
                button{
                    background-color: transparent;
                    border: none;
                }
            }

            &:hover {
                .menu-item-btn-wrapper {
                    display: flex;
                }
            }
        }

        @media (max-width: 900px) {
            .menu-item-btn-wrapper {
                display: flex !important;
            }
        }
    }
}
</style>
