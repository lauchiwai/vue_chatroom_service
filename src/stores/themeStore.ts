// stores/theme.ts
import { defineStore } from 'pinia'

enum ThemeName {
    LIGHT = 'light',
    DARK = 'dark'
}

export const useThemeStore = defineStore('theme', {
    state: () => ({
        currentTheme: ThemeName.LIGHT
    }),

    actions: {
        initialize() {
            const saved = localStorage.getItem('theme') as ThemeName | null
            this.currentTheme = saved && Object.values(ThemeName).includes(saved)
                ? saved
                : ThemeName.DARK
        },

        toggleTheme() {
            this.currentTheme = this.currentTheme === ThemeName.LIGHT
                ? ThemeName.DARK
                : ThemeName.LIGHT
            localStorage.setItem('theme', this.currentTheme)
        }
    }
})