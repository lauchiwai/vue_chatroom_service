<template>
    <div class="login-container" :data-theme="themeStore.currentTheme">
        <a-card class="login-card">
            <template #title>
                <h2 class="login-title">登入</h2>
            </template>
        
            <a-form
            :model="loginFrom"
            @finish="handleLogin"
            class="login-form"
            layout="vertical"
            >
                <a-form-item
                    label="帳號"
                    name="username"
                    :rules="[{ required: true, message: '請輸入使用者名稱!' }]"
                >
                    <a-input
                        v-model:value="loginFrom.username"
                        placeholder="Username"
                        size="large"
                    >
                    <template #prefix>
                        <UserOutlined />
                    </template>
                    </a-input>
                </a-form-item>
        
                <a-form-item
                    label="密碼"
                    name="password"
                    :rules="[{ required: true, message: '請輸入密碼!' }]"
                >
                    <a-input-password
                        v-model:value="loginFrom.password"
                        placeholder="Password"
                        size="large"
                    >
                        <template #prefix>
                            <LockOutlined />
                        </template>
                    </a-input-password>
                </a-form-item>
        
                <a-form-item>
                    <a-button
                    type="primary"
                    html-type="submit"
                    block
                    size="large"
                    :loading="loading"
                    >
                        登入
                    </a-button>
                </a-form-item>
        
                <a-alert
                    v-if="errorMessage"
                    :message="errorMessage"
                    type="error"
                    show-icon
                    closable
                />
            </a-form>
        </a-card>
    </div>
</template>

<script setup lang="ts">
import type { LoginRequest, LoginResponse } from '@/types/auth/user'
import type { ApiResponse } from '@/types/api/apiResponse'

import { ref, onMounted } from 'vue'
import { UserService } from '@/services/userService'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { useRoute, useRouter } from 'vue-router'
import { useThemeStore } from '@/stores/themeStore'

const route = useRoute()
const router = useRouter()
const themeStore = useThemeStore()

const errorMessage = ref('')
const loading = ref(false)
const loginFrom = ref<LoginRequest>({
username: "",
password: ""
})

onMounted(() => {
themeStore.initialize()
})

const handleLogin = async () => {
try {
    loading.value = true
    errorMessage.value = ''
    
    const response: ApiResponse<LoginResponse> = await UserService.login(
    loginFrom.value.username,
    loginFrom.value.password
    )
    
    if (response.isSuccess) {
    const redirectPath = route.query.redirect?.toString() || '/chatroom'
    router.push(decodeURIComponent(redirectPath))
    } else {
    message.error("錯誤訊息: " + response.message)
    errorMessage.value = '登入失敗，請檢查帳號密碼'
    }
} catch (error) {
    errorMessage.value = '發生錯誤，請稍後再試' + error
} finally {
    loading.value = false
}
}
</script>

<style lang="scss" scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 24px;
    @include theme(background-color, background);
    transition: all 0.3s ease;

    .login-card {
        width: 100%;
        max-width: 400px;
        border-radius: 8px;
        @include theme(background-color, form-bg);
        @include theme(border-color, border);
        border: 1px solid;

        @media (max-width: 576px) {
            & {
                max-width: 100%;
                height: 100vh;
                display: flex;
                flex-direction: column;
                justify-content: center;
                @include theme(background-color, form-bg);
            }
        }

        .login-title {
            text-align: center;
            margin-bottom: 0;
            @include theme(color, text);

            @media (max-width: 576px) {
                font-size: 24px;
                margin-bottom: 32px;
                height: 30px;
            }
        }

        .login-form {
            :deep(.ant-form-item-label > label) {
                @include theme(color, text);
            }

            :deep(.ant-input-affix-wrapper) {
                @include theme(background-color, form-bg);
                @include theme(border-color, border);
                @include theme(color, text); 
            
                .ant-input-prefix {
                    @include theme(color, text-secondary); 
                }

                &:hover {
                    @include theme(border-color, primary);
                }

                &.ant-input-affix-wrapper-focused {
                    @include theme(border-color, primary);
                }
            }

            :deep(.anticon) {
                @include theme(color, text);
                > * {
                    @include theme(color, text);
                }
            }

            :deep(.ant-input) {
                @include theme(background-color, input-bg);
                @include theme(color, text);
            }

            :deep(.ant-input::placeholder) {
                @include theme(color, text);
            }

            :deep(.ant-btn-primary) {
                @include theme(background-color, primary);
                border-color: transparent;
                transition: all 0.3s ease;

                &:hover {
                    opacity: 0.9;
                }
            }

            :deep(.ant-alert-error) {
                @include theme(background-color, alert-bg);
                @include theme(border-color, border);
                @include theme(color, text);
            }

            :deep(.ant-input-password-icon) {
                @include theme(color, text-secondary);
                transition: color 0.2s ease;

                &:hover {
                    @include theme(color, primary);
                }
            }
        }
    }
}

@media (max-width: 576px) {
    .login-container {
        padding: 0;
        @include theme(background-color, form-bg);

        :deep(.ant-card .ant-card-body) {
            height: 70%;
        }

        .login-form {
            :deep(.ant-input-affix-wrapper .ant-input-prefix) {
                @include theme(color, text);
            }
        }
    }
}
</style>