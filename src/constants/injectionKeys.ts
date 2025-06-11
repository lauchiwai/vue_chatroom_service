import type { InjectionKey, ComputedRef } from 'vue'

export const ArticleIdKey = Symbol() as InjectionKey<ComputedRef<number | undefined>>

export interface ChatFunctions {
    createSession?: () => Promise<void>
    deleteSession?: (id: number) => Promise<void>
}

export const ChatHandlersKey = Symbol('chat-handlers');
export const ChatFunctionsKey: InjectionKey<ChatFunctions> = Symbol('ChatFunctions')
