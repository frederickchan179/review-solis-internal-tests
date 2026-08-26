# Build AGENT.md + exercises/manifest.json, then serve with nginx.
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json ./
COPY scripts ./scripts
COPY exercises ./exercises

RUN npm run build

FROM nginx:1.27-alpine
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY index.html /usr/share/nginx/html/index.html
COPY hub /usr/share/nginx/html/hub
COPY --from=build /app/exercises /usr/share/nginx/html/exercises

EXPOSE 80
