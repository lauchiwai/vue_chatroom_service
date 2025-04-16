<template>
    <div class="checkbox-container" :class=" isChecked ? 'selected-style' : 'defult-style'" @click="toggleCheck">
        <input
            type="checkbox"
            v-model="isChecked"
            class="hidden-checkbox"
        />
        
        <span class="label-text">{{ props.label }}</span>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    label: {
        type: String ,
        required: true,
    }
})

const isChecked = defineModel('modelValue', {
    type: Boolean,
    required: true
})

const toggleCheck = () => {
    isChecked.value = !isChecked.value;
};
</script>

<style scoped>
.checkbox-container {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 5px;
    padding: 6px 12px;
}

.defult-style{
    background-color: #FCFCFC;
    border: 2px solid #E0E0E0;
}

.selected-style{
    background-color: #D2E9FF;
    border: 2px solid #D2E9FF;
}

.hidden-checkbox {
    position: absolute;
    opacity: 0;
    height: 0;
    width: 0;
    overflow: hidden;
}
</style>