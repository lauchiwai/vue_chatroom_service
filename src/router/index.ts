import type { RouteLocationNormalized } from 'vue-router'

import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/authStore'
import { message } from 'ant-design-vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/login',
            name: 'Login',
            component: () => import('@/views/login/index.vue'),
            meta: { layout: 'fullScreen', requiresAuth: false, showHeader: false, showMobileNav: false, showSideBar: true }
        },
        {
            path: '/',
            name: 'Home',
            component: () => import('@/views/home/index.vue'),
            meta: { layout: 'main', requiresAuth: true, showHeader: true, showMobileNav: false, showSideBar: true }
        },
        {
            path: '/Home',
            name: 'Home',
            component: () => import('@/views/home/index.vue'),
            meta: { layout: 'main', requiresAuth: true, showHeader: true, showMobileNav: true, showSideBar: true }
        },
        {
            path: '/BookShelf',
            name: '書架',
            component: () => import('@/views/article/index.vue'),
            meta: { layout: 'main', requiresAuth: true, showHeader: false, showMobileNav: true, showSideBar: true }
        },
        {
            path: '/BookShelf/Add',
            name: 'Acticle Generator',
            component: () => import('@/views/article/add/index.vue'),
            meta: { layout: 'main', requiresAuth: true, showHeader: false, showMobileNav: false, showSideBar: true }
        },
        {
            path: '/BookShelf/View/:id',
            name: 'Acticle Viewer',
            component: () => import('@/views/article/view/index.vue'),
            meta: { layout: 'main', requiresAuth: true, showHeader: false, showMobileNav: true, showSideBar: true }
        },
        {
            path: '/Chatroom',
            name: '聊天室',
            component: () => import('@/views/chatroom/index.vue'),
            meta: { layout: 'main', requiresAuth: true, showHeader: false, showMobileNav: false, showSideBar: true }
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'NotFound',
            component: () => import('@/views/notFound/index.vue'),
            meta: { layout: 'fullScreen', requiresAuth: true, showHeader: false, showMobileNav: false, showSideBar: true }
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