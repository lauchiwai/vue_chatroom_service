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

FROM openresty/openresty:1.25.3.1-alpine


COPY nginx.conf /usr/local/openresty/nginx/conf/nginx.conf
COPY --from=builder /app/dist /usr/local/openresty/nginx/html

RUN chown -R nobody:nobody /usr/local/openresty/nginx/html && \
    chmod -R 755 /usr/local/openresty/nginx/html

EXPOSE 80
CMD ["/usr/local/openresty/bin/openresty", "-g", "daemon off;"]