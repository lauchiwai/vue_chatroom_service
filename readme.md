# Vue3

A modern Vue3 frontend, integrating Pinia state management, dual JWT authentication, SSE real-time communication, CSP security policies, and Docker containerized deployment.

## Features

- **Dual JWT Authentication System** (Automatic refresh of Access Token & Refresh Token)
- **Server-Sent Events (SSE) Real-time Data Push**
- **Strict CSP Security Policy** (Dynamic Nonce Injection)
- **Responsive Web Design (RWD) Support**
- **Docker Containerization** and CI/CD Automated Deployment
- Pinia State Management + Vue Router Routing Control

## Tech Stack

**Frontend**
Vue3 + TypeScript | Pinia | Vue Router | Axios | JWT-decode

**Security**
CSP nonce

**Infrastructure**
Docker | GitHub Actions | Nginx (Docker Deployment Version)

## Environment Requirements

- Node.js >= 22.x
- npm >= 9.x
- Docker >= 24.x
- Modern Browser (Supports ES2020)

# Installing Dependencies

```
npm install
```

# Setting Up Environment

1. Create .env.development file
2. Set VITE_API_BASE_URL backend API
3. Execute command to run

```
npm run dev
```
