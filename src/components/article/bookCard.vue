<template>
    <div class="book-container">
        <MyCard :show-border="true">
            <template #content>
                <BookItem :title="props.title" />
            </template>
        </MyCard>
    </div>
</template>

<script setup lang="ts">
import MyCard from '@/components/common/myCard.vue';
import BookItem from '@/components/article/bookItem.vue'

const props = defineProps({
    title: {
        type: String,
        required: true
    },
})
</script>

<style scoped>
.book-container{
    cursor: pointer;
    display: flex;
    height: 160px;
    border-radius: 20px;
    width: 100%;
}
</style>