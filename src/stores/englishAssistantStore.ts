import { defineStore } from 'pinia';
import type {
    EnglishWordAssistantRequest,
    TextLinguisticAssistantRequest
} from '@/types/englishAssistant/englishAssistant';
import type { ChatMessage } from '@/types/chatHistory/chatHistory';
import { EnglishAssistantService } from '@/services/englishAssistantService';
import { message } from 'ant-design-vue';
import { nextTick } from 'vue'
import dayjs from 'dayjs';

export const useEnglishAssistantStore = defineStore('englishAssistant', {
    state: () => ({
        text: '' as string,
        messages: [] as ChatMessage[],
        inputText: '' as string,
        streamingController: null as AbortController | null,
        tempAssistantMessage: '' as string,
        isChatAsyncing: false as boolean,
        isInit: true as boolean,
        englishWordTipsModalOpen: false as boolean,
        englishWordAssistantModalOpen: false as boolean,
        textLinguisticAssistantModalOpen: false as boolean,
        englishTTSModalOpen: false as boolean,
        selectedText: '' as string,
        isSpeaking: false as boolean
    }),
    actions: {
        resetEnglishAssistantStore() {
            this.isInit = true;
            this.text = '';
            this.messages = [];
            this.inputText = '';
            this.streamingController = null;
            this.tempAssistantMessage = '';
            this.isChatAsyncing = false;
        },
        pushUserQuestion(question: string) {
            if (this.isInit) return;
            this.messages.push({
                role: 'user',
                content: question,
                timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss')
            });
        },
        pushAssistantAnswer(answer: string) {
            this.messages.push({
                role: 'assistant',
                content: answer,
                timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss')
            });
        },
        async openModal(modalType: string, text: string) {
            this.selectedText = text;
            this.isInit = true;
            this.messages = [];

            this.selectedText = text;
            this.englishWordTipsModalOpen = false;
            this.englishWordAssistantModalOpen = false;
            this.textLinguisticAssistantModalOpen = false;
            this.englishTTSModalOpen = false;

            await nextTick();

            if (modalType === 'wordTips') this.englishWordTipsModalOpen = true;
            else if (modalType === 'wordAssistant') this.englishWordAssistantModalOpen = true;
            else if (modalType === 'linguistic') this.textLinguisticAssistantModalOpen = true;
            else if (modalType === 'tts') this.englishTTSModalOpen = true;
        },
        toggleWordTipsModal(text: string) {
            this.openModal('wordTips', text);
        },
        toggleWordAssistantModal(text: string) {
            this.openModal('wordAssistant', text);
        },
        toggleLinguisticModal(text: string) {
            this.openModal('linguistic', text);
        },
        toggleTTSModal(text: string) {
            this.openModal('tts', text);
        },
        async streamEnglishWordAssistant(request: EnglishWordAssistantRequest) {
            try {
                this.isChatAsyncing = true;
                this.pushUserQuestion(request.message);
                this.tempAssistantMessage = '';
                this.streamingController = new AbortController();
                await EnglishAssistantService.streamEnglishWordAssistantService(
                    request,
                    (chunk) => {
                        if (chunk.error) message.error(chunk.error.message);
                        else this.tempAssistantMessage += chunk.content;
                    },
                    this.streamingController.signal
                );
            } catch (error) {
                message.error('Chat request error');
            } finally {
                this.isInit = false;
                this.isChatAsyncing = false;
                this.pushAssistantAnswer(this.tempAssistantMessage);
                this.inputText = '';
                this.streamingController = null;
                this.tempAssistantMessage = '';
            }
        },
        async streamWordTipsService(request: EnglishWordAssistantRequest) {
            try {
                this.isChatAsyncing = true;
                this.pushUserQuestion(request.message);
                this.tempAssistantMessage = '';
                this.streamingController = new AbortController();
                await EnglishAssistantService.streamWordTipsService(
                    request,
                    (chunk) => {
                        if (chunk.error) message.error(chunk.error.message);
                        else this.tempAssistantMessage += chunk.content;
                    },
                    this.streamingController.signal
                );
            } catch (error) {
                message.error('Chat request error');
            } finally {
                this.isInit = false;
                this.isChatAsyncing = false;
                this.pushAssistantAnswer(this.tempAssistantMessage);
                this.inputText = '';
                this.streamingController = null;
                this.tempAssistantMessage = '';
            }
        },
        async streamWordTranslateService(request: EnglishWordAssistantRequest) {
            try {
                this.isChatAsyncing = true;
                this.pushUserQuestion(request.message);
                this.tempAssistantMessage = '';
                this.streamingController = new AbortController();
                await EnglishAssistantService.streamWordTranslateService(
                    request,
                    (chunk) => {
                        if (chunk.error) message.error(chunk.error.message);
                        else this.tempAssistantMessage += chunk.content;
                    },
                    this.streamingController.signal
                );
            } catch (error) {
                message.error('Chat request error');
            } finally {
                this.isInit = false;
                this.isChatAsyncing = false;
                this.pushAssistantAnswer(this.tempAssistantMessage);
                this.inputText = '';
                this.streamingController = null;
                this.tempAssistantMessage = '';
            }
        },
        async streamEnglishTextLinguisticAssistant(request: TextLinguisticAssistantRequest) {
            try {
                this.isChatAsyncing = true;
                this.pushUserQuestion(request.message);
                this.tempAssistantMessage = '';
                this.streamingController = new AbortController();
                await EnglishAssistantService.streamTextLinguisticAssistantService(
                    request,
                    (chunk) => {
                        if (chunk.error) message.error(chunk.error.message);
                        else this.tempAssistantMessage += chunk.content;
                    },
                    this.streamingController.signal
                );
            } catch (error) {
                message.error('Chat request error');
            } finally {
                this.isInit = false;
                this.isChatAsyncing = false;
                this.pushAssistantAnswer(this.tempAssistantMessage);
                this.inputText = '';
                this.streamingController = null;
                this.tempAssistantMessage = '';
            }
        },
        abortStreaming() {
            this.streamingController?.abort();
        }
    }
});
