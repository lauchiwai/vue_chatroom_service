import { defineStore } from 'pinia'
import { ref, h } from 'vue'
import {
    HomeOutlined,
    BookOutlined,
    CommentOutlined,
    SettingOutlined
} from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'

export interface MenuItem {
    key: string,
    icon: any,
    label: string,
    title: string
}

export const useSiderStore = defineStore('sider', () => {
    const selectedKeys = ref(['Home'])
    const router = useRouter()
    const settingOpen = ref(false)

    const items: MenuItem[] = [
        {
            key: 'Home',
            icon: () => h(HomeOutlined),
            label: 'Home',
            title: 'Home',
        },
        {
            key: 'Book',
            icon: () => h(BookOutlined),
            label: 'Book',
            title: 'Book',
        },
        {
            key: 'AiTalk',
            icon: () => h(CommentOutlined),
            label: 'Ai Talk',
            title: 'Ai Talk',
        },
        {
            key: 'Setting',
            icon: () => h(SettingOutlined),
            label: 'Setting',
            title: 'Setting',
        },
    ];

    const setSelectedKeys = (keys: string[]) => {
        selectedKeys.value = keys
    }

    const selectEvent = () => {
        if (selectedKeys.value[0] == "Setting") {
            settingOpen.value = true
        } else {
            router.push(selectedKeys.value[0])
        }
    }

    const closeSetting = () => {
        settingOpen.value = false
    }

    return {
        selectedKeys,
        settingOpen,
        items,
        setSelectedKeys,
        selectEvent,
        closeSetting
    }
})