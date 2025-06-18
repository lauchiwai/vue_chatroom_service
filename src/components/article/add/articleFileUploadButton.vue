<template>
    <div class="upload-section">
        <a-upload-dragger
            v-model:fileList="fileList"
            name="file"
            :multiple="false"
            :before-upload="beforeUpload"
            :show-upload-list="false"
            :accept="supportedFormats"
            class="upload-dragger"
        >
            <template #default>
                <div class="upload-content-container">
                    <CloudUploadOutlined class="upload-icon" />
                    <p class="upload-text">
                        {{ uploadText }}
                    </p>
                    <p class="upload-hint">
                        {{ hintText }}
                    </p>
                    <p class="upload-hint">
                        {{ sizeText }}
                    </p>
                </div>
            </template>
        </a-upload-dragger>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { message } from "ant-design-vue";
import { CloudUploadOutlined } from "@ant-design/icons-vue";

const props = defineProps({
    uploadText: {
        type: String,
        default: "點擊或拖拽文件到這裡上傳",
    },
    hintText: {
        type: String,
        default: "支持格式：TXT, DOC, DOCX, PDF, MD",
    },
    sizeText: {
        type: String,
        default: "最大文件大小：10MB",
    },
    supportedFormats: {
        type: String,
        default: ".txt,.doc,.docx,.pdf,.md",
    },
    maxFileSize: {
        type: Number,
        default: 10 * 1024 * 1024,
    },
});

const emit = defineEmits(["file-uploaded"]);
const fileList = ref<any[]>([]);

const beforeUpload = (file: File) => {
    const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    const allowedFormats = props.supportedFormats
        .split(",")
        .map((f) => f.trim().toLowerCase());

    if (!allowedFormats.includes(extension)) {
        message.error(`不支援的文件格式，請上傳 ${props.supportedFormats} 格式的文件`);
        return false;
    }

    if (file.size > props.maxFileSize) {
        message.error(`文件大小超過限制 (${props.sizeText})`);
        return false;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        if (e.target?.result) {
            emit("file-uploaded", e.target.result);
        }
    };
    reader.onerror = () => {
        message.error("文件讀取失敗");
        emit("file-uploaded", null);
    };

    reader.readAsText(file, "UTF-8");

    return false;
};
</script>

<style scoped lang="scss">
.upload-section {
    width: 100%;
    height: 100%;
    display: flex;

    .upload-dragger {
        height: 100%;
        width: 100%;
        display: flex;
        position: relative;
        padding: 40px 20px;
        background-color: #fafafa;
        border: 2px dashed #d9d9d9;
        border-radius: 8px;
        transition: all 0.3s;
        box-sizing: border-box;
        overflow: hidden;

        &:hover {
            border-color: #1890ff;
            background-color: #f0f7ff;
        }

        .upload-content-container {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
        }

        .upload-icon {
            font-size: 48px;
            color: #1890ff;
            margin-bottom: 16px;
        }

        .upload-text {
            font-size: 18px;
            font-weight: 500;
            margin-bottom: 8px;
            text-align: center;
        }

        .upload-hint {
            font-size: 14px;
            color: rgba(0, 0, 0, 0.6);
            text-align: center;
            margin-bottom: 4px;
        }
    }
}

@media (max-width: 768px) {
    .upload-dragger {
        padding: 30px 15px;
        min-height: 250px;

        .upload-icon {
            font-size: 36px;
        }

        .upload-text {
            font-size: 16px;
        }

        .upload-hint {
            font-size: 13px;
        }
    }
}

@media (max-width: 480px) {
    .upload-dragger {
        padding: 20px 10px;

        .upload-text {
            font-size: 15px;
        }
    }
}
</style>
