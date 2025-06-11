type TTSStatus = 'idle' | 'speaking' | 'error';
type TTSStatusCallback = (status: TTSStatus) => void;

interface TTSConfig {
    lang?: string;
    rate?: number;
    pitch?: number;
    volume?: number;
    voiceName?: string;
}

class TTSService {
    private utterance: SpeechSynthesisUtterance | null = null;
    private status: TTSStatus = 'idle';
    private statusCallback: TTSStatusCallback | null = null;
    private defaultConfig: TTSConfig = {
        lang: 'zh-HK',
        rate: 0.9,
        pitch: 1.1,
        volume: 1,
        voiceName: ''
    };

    constructor(config?: TTSConfig) {
        this.defaultConfig = { ...this.defaultConfig, ...config };
        this.init();
    }

    private init() {
        if (!this.isSupported()) {
            this.updateStatus('error');
            return;
        }
        window.speechSynthesis.getVoices();
    }

    isSupported(): boolean {
        return 'speechSynthesis' in window;
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

    private findVoice(lang: string) {
        const voices = window.speechSynthesis.getVoices();
        return voices.find(voice =>
            voice.lang === lang ||
            voice.name.includes('Chinese') ||
            voice.name.includes('Cantonese')
        );
    }

    speak(text: string, config?: TTSConfig) {
        if (!text || !this.isSupported()) {
            this.updateStatus('error');
            return false;
        }

        this.stop();

        const finalConfig = { ...this.defaultConfig, ...config };
        this.utterance = new SpeechSynthesisUtterance(text);

        this.utterance.lang = finalConfig.lang || 'zh-HK';
        this.utterance.rate = finalConfig.rate || 0.9;
        this.utterance.pitch = finalConfig.pitch || 1.1;
        this.utterance.volume = finalConfig.volume || 1;

        const preferredVoice = this.findVoice(this.utterance.lang);
        if (preferredVoice) {
            this.utterance.voice = preferredVoice;
        }

        this.utterance.onstart = () => this.updateStatus('speaking');
        this.utterance.onend = () => this.updateStatus('idle');
        this.utterance.onerror = () => this.updateStatus('error');

        window.speechSynthesis.speak(this.utterance);
        return true;
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

    private updateStatus(status: TTSStatus) {
        this.status = status;
        if (this.statusCallback) {
            this.statusCallback(status);
        }
    }
}

export const tts = new TTSService();
