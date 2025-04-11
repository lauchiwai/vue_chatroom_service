import type { RouteLocationNormalized } from 'vue-router'

import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/authStore'
import { message } from 'ant-design-vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/login/index.vue'),
            meta: { layout: 'fullScreen' }
        },
        {
            path: '/chatroom',
            name: 'chatroom',
            component: () => import('@/views/chatroom/index.vue'),
            meta: { layout: 'main', requiresAuth: true }
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'NotFound',
            component: () => import('@/views/notFound/index.vue'),
            meta: { layout: 'fullScreen', requiresAuth: true }
        }
    ]
})

router.beforeEach((to: RouteLocationNormalized) => {
    const userStore = useUserStore()
    const isAuthenticated = (userStore.accessToken && userStore.refreshToken);
    if (to.meta.requiresAuth && !isAuthenticated) {
        userStore.logout()
        message.error("目前尚未登入")
        return {
            path: '/login',
        }
    } else if (to.name == 'login' && isAuthenticated) {
        message.error("目前已經登入")
        return {
            path: '/chatroom',
        }
    } else {
        return true;
    }
})

export default router