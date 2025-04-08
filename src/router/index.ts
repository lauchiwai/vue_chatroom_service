import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/authStore'
import login from '@/views/login/index.vue'
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/login',
            name: 'login',
            component: () => login, // lazy loading
            meta: { layout: 'fullScreen' }
        },
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