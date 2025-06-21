import { defineStore } from 'pinia'
import { ref, h, onMounted } from 'vue'
import {
    HomeOutlined,
    BookOutlined,
    CommentOutlined,
    SettingOutlined,
    StarOutlined
} from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import { ROUTE_NAMES, ROUTE_PATHS } from '@/router'

export type MenuKey = typeof ROUTE_NAMES[keyof typeof ROUTE_NAMES] | 'Setting' | 'Word'

export interface MenuItem {
    key: MenuKey;
    icon: any;
    label: string;
    title: string;
    path?: string;
}

export const useSiderStore = defineStore('sider', () => {
    const router = useRouter()
    const settingOpen = ref(false)

    const items: MenuItem[] = [
        {
            key: ROUTE_NAMES.HOME,
            icon: () => h(HomeOutlined),
            label: 'Home',
            title: 'Home',
            path: ROUTE_PATHS.HOME
        },
        {
            key: 'Word',
            icon: () => h(StarOutlined),
            label: 'Word',
            title: 'Word',
            path: ROUTE_PATHS.WORD
        },
        {
            key: ROUTE_NAMES.BOOKSHELF,
            icon: () => h(BookOutlined),
            label: 'BookShelf',
            title: 'BookShelf',
            path: ROUTE_PATHS.BOOKSHELF
        },
        {
            key: ROUTE_NAMES.CHATROOM,
            icon: () => h(CommentOutlined),
            label: 'Ai Talk',
            title: 'Ai Talk',
            path: ROUTE_PATHS.CHATROOM
        },
        {
            key: 'Setting',
            icon: () => h(SettingOutlined),
            label: 'Setting',
            title: 'Setting',
        },
    ];

    const selectedKeys = ref<MenuKey[]>([])

    const syncRouteToMenu = () => {
        const routeName = router.currentRoute.value.name as MenuKey | undefined
        if (routeName && routeName !== 'Setting' && routeName !== 'Word') {
            selectedKeys.value = [routeName]
        }
    }

    onMounted(syncRouteToMenu)
    router.afterEach(syncRouteToMenu)

    const selectEvent = () => {
        const selectedKey = selectedKeys.value[0]

        if (selectedKey === 'Setting') {
            settingOpen.value = true
        } else {
            const targetRoute = items.find(item => item.key === selectedKey)
            if (targetRoute?.path) {
                if (router.currentRoute.value.path !== targetRoute.path) {
                    router.push(targetRoute.path)
                }
            }
        }
    }

    const closeSetting = () => {
        settingOpen.value = false
        syncRouteToMenu()
    }

    const setSelectedKeys = (keys: MenuKey[]) => {
        selectedKeys.value = keys
    }

    return {
        selectedKeys,
        settingOpen,
        items,
        setSelectedKeys,
        selectEvent,
        closeSetting,
    }
})
