# Vue3

一個現代化 Vue3 前端，整合 Pinia 狀態管理、雙 JWT 驗證、SSE 實時通信、CSP 安全策略與 Docker 容器化部署。

## 功能特性

- **雙 JWT 驗證系統** (Access Token & Refresh Token 自動刷新)
- **Server-Sent Events (SSE) 實時數據推送**
- **嚴格 CSP 安全策略** (Nonce 動態注入)
- **響應式網頁設計** (RWD) 支援
- **Docker 容器化**與 CI/CD 自動化部署
- Pinia 狀態管理 + Vue Router 路由控制

## 技術棧

**前端**
Vue3 + TypeScript | Pinia | Vue Router | Axios | JWT-decode

**安全**
CSP nonce

**基礎設施**
Docker | GitHub Actions | Nginx (Docker 部署版)

## 環境要求

- Node.js >= 22.x
- npm >= 9.x
- Docker >= 24.x
- 現代瀏覽器 (支援 ES2020)

# 安裝依賴

```
npm install
```

# 創建環境

1. 創建 .env.development 文件
2. 設定 VITE_API_BASE_URL 後端 api
3. 執行指令運行

```
npm run dev
```
