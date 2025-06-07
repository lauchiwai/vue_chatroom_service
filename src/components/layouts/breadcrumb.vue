<template>
    <a-breadcrumb class="breadcrumb">
        <a-breadcrumb-item>
            <a href="/Home">
                <HomeOutlined/>
                <span style="margin-left: 5px;">Home</span>
            </a>
        </a-breadcrumb-item>
        <a-breadcrumb-item v-for="(breadcrumbItem, index) in breadcrumbItems" :key="breadcrumbItem.fullPath">
            <a :href="breadcrumbItem.fullPath" v-if="index != breadcrumbItems.length -1">
                {{ breadcrumbItem.pathTitle }}
            </a>
            <span v-else>
                {{ breadcrumbItem.pathTitle }}
            </span>
        </a-breadcrumb-item>
    </a-breadcrumb>
</template>

<script setup lang="ts">
import type { RouteLocationMatched } from 'vue-router';

import { HomeOutlined } from '@ant-design/icons-vue'
import { computed } from 'vue';
import { useRoute } from 'vue-router';

interface BreadcrumbItem {
    pathTitle: string;
    fullPath: string;
}

const route = useRoute();

const breadcrumbItems = computed<BreadcrumbItem[]>(() => {
    return route.matched
        .filter(r => r.path) 
        .flatMap((r: RouteLocationMatched) => {
            const segments = r.path.split('/')
                .filter(segment => segment && !segment.startsWith(':'));
            
            let accumulatedPath = ''; 
            return segments.map((segment) => {
                accumulatedPath += `/${segment}`; 
                return {
                    pathTitle: segment,
                    fullPath: accumulatedPath
                };
            });
        });
});
</script>

<style scoped>
.breadcrumb {
    padding: 5px 24px;
    color: gray;
}
</style>
