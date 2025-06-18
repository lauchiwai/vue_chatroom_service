<template>
    <a-modal
        :open="modalOpen"
        :footer="null"
        @cancel="handleCancel"
        :wrapClassName="'responsive-modal-' + uid"
    >
        <div class="modal-container">
            <div class="section left-section">
                <div class="fixed-container">
                    <slot name="left-button"></slot>
                </div>
            </div>

            <div class="section right-section">
                <div class="fixed-container">
                    <slot name="right-button"></slot>
                </div>
            </div>
        </div>
    </a-modal>
</template>

<script setup lang="ts">
import { defineModel, ref, onMounted, onUnmounted, getCurrentInstance } from 'vue';

const modalOpen = defineModel('modalOpen', { type: Boolean, required: true });
const uid = ref<string | number>(Date.now());

const instance = getCurrentInstance();
if (instance) {
    uid.value = instance.uid;
}

const handleCancel = () => {
    modalOpen.value = false;
};

const styleElement = ref<HTMLStyleElement | null>(null);

onMounted(() => {
    styleElement.value = document.createElement('style');
    styleElement.value.type = 'text/css';
    document.head.appendChild(styleElement.value);
    updateStyles();
    window.addEventListener('resize', updateStyles);
});

onUnmounted(() => {
    if (styleElement.value && document.head.contains(styleElement.value)) {
        document.head.removeChild(styleElement.value);
    }
    window.removeEventListener('resize', updateStyles);
});

const updateStyles = () => {
    if (!styleElement.value) return;
    
    const css = `
        .responsive-modal-${uid.value} .ant-modal {
            overflow: hidden;
        }
        
        .responsive-modal-${uid.value} .ant-modal {
            width: 800px !important;
            height: 600px;
        }
        
        @media (max-width: 1440px) {
            .responsive-modal-${uid.value} .ant-modal {
                width: 700px !important;
                height: 550px;
            }
        }
        
        @media (max-width: 1200px) {
            .responsive-modal-${uid.value} .ant-modal {
                width: 650px !important;
                height: 500px;
            }
        }
        
        @media (max-width: 992px) {
            .responsive-modal-${uid.value} .ant-modal {
                width: 600px !important;
                height: 450px;
            }
        }
        
        @media (max-width: 768px) {
            .responsive-modal-${uid.value} .ant-modal {
                width: 60vw !important;
                height: 80vh;
                max-height: 650px;
            }
        }
        
        @media (max-width: 576px) {
            .responsive-modal-${uid.value} .ant-modal {
                width: 95vw !important;
                height: 85vh;
                max-height: 600px;
            }
        }
        
        @media (max-width: 480px) {
            .responsive-modal-${uid.value} .ant-modal {
                height: 75vh;
            }
        }
    `;
    
    styleElement.value.textContent = css;
};
</script>

<style lang="scss" scoped>
.modal-container {
    display: flex;
    height: 100%;

    .section {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 10px;
    }

    .fixed-container {
        width: 300px;
        height: 300px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .left-section {
        border-right: 1px dashed #e8e8e8;
    }
}

@media (max-width: 1200px) {
    .modal-container .fixed-container {
        width: 250px;
        height: 280px;
    }
}

@media (max-width: 992px) {
    .modal-container .fixed-container {
        width: 250px;
        height: 280px;
    }
}

@media (max-width: 768px) {
    .modal-container {
        flex-direction: column;
        height: auto;
        min-height: 280px;

        .section {
            width: 100%;
            height: 50%;
            padding: 20px 10px;
        }

        .fixed-container {
            width: 70%;
            max-width: 400px;
            height: 180px;
        }

        .left-section {
            border-right: none;
            border-bottom: 1px dashed #e8e8e8;
        }
    }
}

@media (max-width: 480px) {
    .modal-container .fixed-container {
        height: 160px;
        width: 70%;
    }
}
</style>
