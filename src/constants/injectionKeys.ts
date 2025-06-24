import type { InjectionKey, ComputedRef } from 'vue'

export const ArticleIdKey = Symbol() as InjectionKey<ComputedRef<number | undefined>>

export const ChatHandlersKey = Symbol('chat-handlers');
