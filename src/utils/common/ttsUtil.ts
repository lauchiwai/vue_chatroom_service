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

    constructor(config?: TTSConfig) {
        this.defaultConfig = {
            lang: 'en-US',
            rate: 1,
            pitch: 1,
            volume: 1,
            ...config
        };
    }

    isSupported(): boolean {
        return 'speechSynthesis' in window;
    }

    private async getVoices(): Promise<SpeechSynthesisVoice[]> {
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

        const finalConfig = {
            ...this.defaultConfig,
            ...config
        };

        this.utterance = new SpeechSynthesisUtterance(text);
        this.utterance.lang = finalConfig.lang || 'en-US';
        this.utterance.rate = finalConfig.rate || 1;
        this.utterance.pitch = finalConfig.pitch || 1;
        this.utterance.volume = finalConfig.volume || 1;

        if (finalConfig.voiceName) {
            const voices = await this.getVoices();
            const selectedVoice = voices.find(v => v.name === finalConfig.voiceName);
            if (selectedVoice) this.utterance.voice = selectedVoice;
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
