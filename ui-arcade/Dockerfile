## Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

# Generate data.json from the shared cheatsheet (scripts/ lives one level up)
COPY ../scripts /scripts
COPY ../vim-cheatsheet.md /vim-cheatsheet.md
RUN node /scripts/generateData.js ui-arcade || true

COPY . .
RUN npm run build

## Serve stage
FROM nginx:alpine AS server

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s \
  CMD wget -qO- http://localhost/learn-vim/arcade/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
