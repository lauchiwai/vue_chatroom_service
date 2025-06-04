<template>
    <a-modal v-model:open="settingOpen" @ok="handleOk" :footer="null">
        <template #title>系統設定</template>
        <div class="model-container">
            <div class="segmented-container">
                <a-segmented v-model:value="segmentedValue" :options="segmentedData" />
            </div>

            <div class="descriptions-container" v-if="segmentedValue = segmentedData[0]">
                <a-descriptions bordered>
                    <a-descriptions-item label="UserName" :span="3">{{ userName }}</a-descriptions-item>
                    <a-descriptions-item label="logout" :span="3">
                        <a-button type="primary" danger @click="handleLogout">
                            Logout
                        </a-button>
                    </a-descriptions-item>
                </a-descriptions>
            </div>
        </div>
    </a-modal>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue'
import { useUserStore } from '@/stores/authStore'

const userStore = useUserStore()
const userName = computed(() => userStore.userName)
const segmentedData = reactive(['賬號管理']);
const segmentedValue = ref(segmentedData[0]);

const settingOpen = defineModel('settingOpen', {
    type: Boolean,
    required: true
})

const handleOk = () =>{
    settingOpen.value = !settingOpen.value;
}

const handleLogout = () =>{
    userStore.logout()
    window.location.href = '/login'
}
</script>

<style scoped lang="scss"> 
.model-container{
    .segmented-container{
        display: flex;
        align-items: center;
        width: 100%;
    }   

    .descriptions-container{
        margin-top: 5px;
    }
}
</style>


