FROM node:22-alpine as builder

WORKDIR /app

COPY package*.json ./
COPY .env.production . 

RUN rm -rf node_modules && \
    npm cache clean --force && \
    npm ci --ignore-scripts --prefer-offline

RUN cat .env.production

COPY . .

RUN npm run build:prod

FROM nginx:1.25-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]