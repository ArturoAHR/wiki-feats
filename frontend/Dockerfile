FROM node:20-alpine AS base

RUN npm i -g pnpm

FROM base AS dependencies

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

FROM base AS builder

WORKDIR /app
COPY . .
COPY .env.sample .env
COPY --from=dependencies /app/node_modules ./node_modules
RUN pnpm build


FROM nginx:alpine AS production-build

COPY nginx.conf /etc/nginx/nginx.conf

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist /usr/share/nginx/html/
EXPOSE 8080

ENTRYPOINT [ "nginx", "-g", "daemon off;" ]