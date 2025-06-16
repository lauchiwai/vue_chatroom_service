import { defineStore } from 'pinia'
import { ref, computed, onUnmounted } from 'vue'

export const useScreenStore = defineStore('screen', () => {
    const screenWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 0)

    let resizeTimer: number | null = null

    const checkScreenSize = () => {
        if (resizeTimer) clearTimeout(resizeTimer)

        resizeTimer = setTimeout(() => {
            const width = window.innerWidth
            screenWidth.value = width
        }, 150) as unknown as number
    }

    const isMobile = computed(() => screenWidth.value < 768)
    const isPad = computed(() => screenWidth.value >= 768 && screenWidth.value <= 1024)
    const isPc = computed(() => screenWidth.value > 1024)

    if (typeof window !== 'undefined') {
        window.addEventListener('resize', checkScreenSize)
        checkScreenSize()

        onUnmounted(() => {
            window.removeEventListener('resize', checkScreenSize)
            if (resizeTimer) clearTimeout(resizeTimer)
        })
    }

    return { screenWidth, isMobile, isPad, isPc }
})
