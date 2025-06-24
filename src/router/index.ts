import type { RouteLocationNormalized, RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/authStore'
import { message } from 'ant-design-vue'

const ROUTE_NAMES = {
    LOGIN: 'Login',
    HOME: 'Home',
    BOOKSHELF: 'BookShelf',
    BookShelf_AiGenerater: 'BookShelfAiGenerater',
    BookShelf_File_Upload: 'BookShelfFileUpload',
    BOOKSHELF_VIEW: 'BookShelfView',
    WORD: 'Word',
    WORD_VIEW: 'WordView',
    CHATROOM: 'Chatroom',
    NOT_FOUND: 'NotFound'
} as const

const ROUTE_PATHS = {
    LOGIN: '/login',
    HOME: '/Home',
    BOOKSHELF: '/BookShelf',
    BookShelf_AiGenerater: '/BookShelf/AiGenerater',
    BookShelf_File_Upload: '/BookShelf/FileUpload',
    BOOKSHELF_VIEW: '/BookShelf/View/:id',
    WORD: '/Word',
    WORD_VIEW: '/Word/View/:id',
    CHATROOM: '/Chatroom',
    NOT_FOUND: '/:pathMatch(.*)*'
} as const

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: ROUTE_PATHS.HOME
    },
    {
        path: ROUTE_PATHS.LOGIN,
        name: ROUTE_NAMES.LOGIN,
        component: () => import('@/views/login/index.vue'),
        meta: {
            layout: 'fullScreen',
            requiresAuth: false,
            showHeader: false,
            showMobileNav: false,
            showMobileHeader: false,
            showBreadcrumb: false,
            showSideBar: true
        }
    },
    {
        path: ROUTE_PATHS.HOME,
        name: ROUTE_NAMES.HOME,
        component: () => import('@/views/home/index.vue'),
        meta: {
            layout: 'main',
            requiresAuth: true,
            showHeader: true,
            showMobileNav: true,
            showMobileHeader: false,
            showBreadcrumb: false,
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
            showMobileHeader: false,
            showBreadcrumb: false,
            showSideBar: true
        }
    },
    {
        path: ROUTE_PATHS.BookShelf_File_Upload,
        name: ROUTE_NAMES.BookShelf_File_Upload,
        component: () => import('@/views/article/add/fileUpload.vue'),
        meta: {
            layout: 'main',
            requiresAuth: true,
            showHeader: false,
            showMobileNav: false,
            showMobileHeader: true,
            showBreadcrumb: true,
            showSideBar: true
        }
    },
    {
        path: ROUTE_PATHS.BookShelf_AiGenerater,
        name: ROUTE_NAMES.BookShelf_AiGenerater,
        component: () => import('@/views/article/add/aiGenerater.vue'),
        meta: {
            layout: 'main',
            requiresAuth: true,
            showHeader: false,
            showMobileNav: false,
            showBreadcrumb: true,
            showMobileHeader: true,
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
            showMobileNav: false,
            showBreadcrumb: true,
            showMobileHeader: true,
            showSideBar: true
        }
    },
    {
        path: ROUTE_PATHS.WORD,
        name: ROUTE_NAMES.WORD,
        component: () => import('@/views/word/index.vue'),
        meta: {
            layout: 'main',
            requiresAuth: true,
            showHeader: false,
            showMobileNav: true,
            showBreadcrumb: true,
            showMobileHeader: false,
            showSideBar: true
        }
    },
    {
        path: ROUTE_PATHS.WORD_VIEW,
        name: ROUTE_NAMES.WORD_VIEW,
        component: () => import('@/views/word/view/index.vue'),
        meta: {
            layout: 'main',
            requiresAuth: true,
            showHeader: false,
            showMobileNav: true,
            showBreadcrumb: true,
            showMobileHeader: false,
            showSideBar: true
        }
    },
    {
        path: ROUTE_PATHS.CHATROOM,
        name: ROUTE_NAMES.CHATROOM,
        component: () => import('@/views/sceneChat/index.vue'),
        meta: {
            layout: 'main',
            requiresAuth: true,
            showHeader: false,
            showMobileNav: false,
            showBreadcrumb: true,
            showMobileHeader: true,
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
            showBreadcrumb: false,
            showMobileHeader: false,
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
            path: ROUTE_PATHS.HOME
        }
    }

    return true
})

export default router
export { ROUTE_NAMES, ROUTE_PATHS }
