import type { RouteLocationNormalized, RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/authStore'
import { message } from 'ant-design-vue'

const ROUTE_NAMES = {
    LOGIN: 'Login',
    HOME: 'Home',
    HOME_PAGE: 'Home',
    BOOKSHELF: 'BookShelf',
    BOOKSHELF_ADD: 'BookShelfAdd',
    BOOKSHELF_VIEW: 'BookShelfView',
    CHATROOM: 'Chatroom',
    NOT_FOUND: 'NotFound'
} as const

const ROUTE_PATHS = {
    LOGIN: '/login',
    ROOT: '/',
    HOME: '/Home',
    BOOKSHELF: '/BookShelf',
    BOOKSHELF_ADD: '/BookShelf/Add',
    BOOKSHELF_VIEW: '/BookShelf/View/:id',
    CHATROOM: '/Chatroom',
    NOT_FOUND: '/:pathMatch(.*)*'
} as const

const routes: RouteRecordRaw[] = [
    {
        path: ROUTE_PATHS.LOGIN,
        name: ROUTE_NAMES.LOGIN,
        component: () => import('@/views/login/index.vue'),
        meta: {
            layout: 'fullScreen',
            requiresAuth: false,
            showHeader: false,
            showMobileNav: false,
            showSideBar: true
        }
    },
    {
        path: ROUTE_PATHS.ROOT,
        name: ROUTE_NAMES.HOME,
        component: () => import('@/views/home/index.vue'),
        meta: {
            layout: 'main',
            requiresAuth: true,
            showHeader: true,
            showMobileNav: false,
            showSideBar: true
        }
    },
    {
        path: ROUTE_PATHS.HOME,
        name: ROUTE_NAMES.HOME_PAGE,
        component: () => import('@/views/home/index.vue'),
        meta: {
            layout: 'main',
            requiresAuth: true,
            showHeader: true,
            showMobileNav: true,
            showSideBar: true
        }
    },
    {
        path: ROUTE_PATHS.BOOKSHELF,
        name: ROUTE_NAMES.BOOKSHELF,
        component: () => import('@/views/article/index.vue'),
        meta: {
            layout: 'main',
            requiresAuth: true,
            showHeader: false,
            showMobileNav: true,
            showSideBar: true
        }
    },
    {
        path: ROUTE_PATHS.BOOKSHELF_ADD,
        name: ROUTE_NAMES.BOOKSHELF_ADD,
        component: () => import('@/views/article/add/index.vue'),
        meta: {
            layout: 'main',
            requiresAuth: true,
            showHeader: false,
            showMobileNav: false,
            showSideBar: true
        }
    },
    {
        path: ROUTE_PATHS.BOOKSHELF_VIEW,
        name: ROUTE_NAMES.BOOKSHELF_VIEW,
        component: () => import('@/views/article/view/index.vue'),
        meta: {
            layout: 'main',
            requiresAuth: true,
            showHeader: false,
            showMobileNav: true,
            showSideBar: true
        }
    },
    {
        path: ROUTE_PATHS.CHATROOM,
        name: ROUTE_NAMES.CHATROOM,
        component: () => import('@/views/chatroom/index.vue'),
        meta: {
            layout: 'main',
            requiresAuth: true,
            showHeader: false,
            showMobileNav: false,
            showSideBar: true
        }
    },
    {
        path: ROUTE_PATHS.NOT_FOUND,
        name: ROUTE_NAMES.NOT_FOUND,
        component: () => import('@/views/notFound/index.vue'),
        meta: {
            layout: 'fullScreen',
            requiresAuth: true,
            showHeader: false,
            showMobileNav: false,
            showSideBar: true
        }
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

router.beforeEach((to: RouteLocationNormalized) => {
    const userStore = useUserStore()
    const isAuthenticated = !!(userStore.accessToken && userStore.refreshToken)

    if (to.meta.requiresAuth && !isAuthenticated) {
        userStore.logout()
        message.error("目前尚未登入")
        return {
            path: ROUTE_PATHS.LOGIN,
            query: { redirect: to.fullPath }
        }
    }
    else if (to.name === ROUTE_NAMES.LOGIN && isAuthenticated) {
        message.error("目前已經登入")
        return {
            path: ROUTE_PATHS.CHATROOM
        }
    }

    return true
})

export default router
export { ROUTE_NAMES, ROUTE_PATHS } 
