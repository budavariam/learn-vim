## Build stage — context is the repo root (pnpm workspace + scripts/ + vim-cheatsheet.md)
FROM node:24-alpine AS builder

RUN corepack enable
WORKDIR /app

# Install dependencies first so this layer is cached until a manifest changes
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY ui-arcade/package.json ./ui-arcade/
COPY ui-cheatsheet/package.json ./ui-cheatsheet/
COPY ui-practice/package.json ./ui-practice/
RUN pnpm install --frozen-lockfile

# Build the whole site (also generates data.json from vim-cheatsheet.md)
COPY . .
RUN pnpm build

## Serve stage
FROM nginx:alpine AS server

COPY --from=builder /app/dist /usr/share/nginx/html/learn-vim
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s \
  CMD wget -qO- http://localhost/learn-vim/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
