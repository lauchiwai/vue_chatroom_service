type TTSStatus = 'idle' | 'speaking' | 'paused' | 'error';
type TTSStatusCallback = (status: TTSStatus) => void;

interface TTSConfig {
    lang?: string;
    rate?: number;
    pitch?: number;
    volume?: number;
    voiceName?: string;
}

class EnhancedTTSService {
    private utterance: SpeechSynthesisUtterance | null = null;
    private status: TTSStatus = 'idle';
    private statusCallback: TTSStatusCallback | null = null;
    private defaultConfig: TTSConfig;
    private audioContext: AudioContext | null = null;

    constructor(config?: TTSConfig) {
        this.defaultConfig = {
            lang: 'en-US',
            rate: 0.9,
            pitch: 1.1,
            volume: 1,
            ...config
        };
        this.init();
    }

    private init() {
        if (!this.isSupported()) {
            this.updateStatus('error');
            return;
        }
        window.speechSynthesis.getVoices();
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    isSupported(): boolean {
        return 'speechSynthesis' in window;
    }

    private preprocessText(text: string): string {
        const MAX_LENGTH = 30;
        if (text.length > MAX_LENGTH) {
            const segments = [];
            let currentSegment = '';

            text.split('').forEach(char => {
                if (currentSegment.length >= MAX_LENGTH && /[，。！？；]/.test(char)) {
                    segments.push(currentSegment);
                    currentSegment = '';
                }
                currentSegment += char;
            });

            if (currentSegment) segments.push(currentSegment);
            return segments.join('。');
        }

        return text;
    }

    private optimizeParams(text: string): TTSConfig {
        const config: TTSConfig = { ...this.defaultConfig };
        if (text.length > 100) config.rate = Math.min(1.2, config.rate || 1.0);
        if (/！$/.test(text)) {
            config.volume = Math.min(1.5, (config.volume || 1.0) * 1.2);
        }
        return config;
    }

    private async getEnhancedVoices(): Promise<SpeechSynthesisVoice[]> {
        return new Promise((resolve) => {
            const voices = window.speechSynthesis.getVoices();
            if (voices.length) return resolve(voices);
            window.speechSynthesis.onvoiceschanged = () => {
                resolve(window.speechSynthesis.getVoices());
            };
        });
    }

    async speak(text: string, config?: TTSConfig): Promise<boolean> {
        if (!text || !this.isSupported()) {
            this.updateStatus('error');
            return false;
        }

        this.stop();

        const processedText = this.preprocessText(text);
        const finalConfig = {
            ...this.defaultConfig,
            ...this.optimizeParams(text),
            ...config
        };

        this.utterance = new SpeechSynthesisUtterance(processedText);
        this.utterance.lang = finalConfig.lang || 'zh-HK';
        this.utterance.rate = finalConfig.rate || 0.9;
        this.utterance.pitch = finalConfig.pitch || 1.1;
        this.utterance.volume = finalConfig.volume || 1;

        const voices = await this.getEnhancedVoices();
        const langMatch = voices.filter(v => v.lang.startsWith(this.utterance!.lang));

        if (finalConfig.voiceName) {
            this.utterance.voice = voices.find(v =>
                v.name === finalConfig.voiceName) || null;
        }
        if (!this.utterance.voice && langMatch.length) {
            this.utterance.voice = langMatch.find(v => v.localService) || langMatch[0];
        }

        this.utterance.onstart = () => this.updateStatus('speaking');
        this.utterance.onend = () => this.updateStatus('idle');
        this.utterance.onerror = () => this.updateStatus('error');

        window.speechSynthesis.speak(this.utterance);
        return true;
    }

    pause() {
        if (this.status === 'speaking') {
            window.speechSynthesis.pause();
            this.updateStatus('paused');
        }
    }

    resume() {
        if (this.status === 'paused') {
            window.speechSynthesis.resume();
            this.updateStatus('speaking');
        }
    }

    stop() {
        if (this.isSupported() && window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
            this.updateStatus('idle');
        }
    }

    toggle(text?: string) {
        if (!this.isSupported()) return false;

        if (this.status === 'speaking') {
            this.stop();
            return true;
        } else {
            if (text) {
                return this.speak(text);
            }
            return false;
        }
    }

    getStatus(): TTSStatus {
        return this.status;
    }

    registerStatusCallback(callback: TTSStatusCallback) {
        this.statusCallback = callback;
    }

    unregisterStatusCallback() {
        this.statusCallback = null;
    }

    private updateStatus(status: TTSStatus) {
        this.status = status;
        this.statusCallback?.(status);
    }
}

export const tts = new EnhancedTTSService();
