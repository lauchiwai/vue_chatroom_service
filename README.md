# git

## 在本地初始化 Git 倉庫

1. cd /path/to/your/dotnet-project
2. git init

## 配置 .gitignore 文件

新增 .gitignore

## 將文件加入本地倉庫

git add .
git commit -m "Initial commit for fastapi  project"

## 關聯到遠端 github

git remote add origin https://github.com/lauchiwai/py_chat_service.git

# vue_chatroom_service

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```
