import { defineStore } from 'pinia'

export const useScreenStore = defineStore('screen', {
    state: () => ({
        isMobile: false,
    }),
    actions: {
        checkScreenSize() {
            this.isMobile = window.innerWidth < 992
        },
    }
})