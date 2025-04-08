<template>
    <button class="setting-bnt">
        <SettingOutlined :class=" collapsed ? 'm-center' : 'ml-20' "/>
        <span v-if="!collapsed" class="ml-20">設置</span>
    </button>
</template>

<script setup lang="ts">
import { SettingOutlined } from '@ant-design/icons-vue'

const collapsed = defineModel('collapsed', {
    type: Boolean,
    required: true
})
</script>

<style lang="scss" scoped>
.setting-bnt{
    height: 100%;
    width: 100%;
    border: 0px;
    background-color: white;
    display: flex;
    align-items: center;
    font-size: 16px;

    &:hover{
        background-color: #f0f0f0;
        cursor: pointer;
    }
    
    span{
        white-space: nowrap;
        overflow: hidden;
    }

    span.ml-20{
        margin-left: 20px;
    };

    span.m-center{
        margin: 0 auto;
    }
}
</style>