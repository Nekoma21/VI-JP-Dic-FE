FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build       # build ra dist/

FROM nginx:alpine
RUN apk add --no-cache bash
WORKDIR /usr/share/nginx/html

# Copy build artifact và env.js placeholder
COPY --from=build /app/dist . 
# public/env.js đã nằm trong dist/ nhờ Vite tự copy

# Copy nginx.conf và entrypoint
COPY nginx.conf /etc/nginx/nginx.conf
COPY fe-entrypoint.sh /usr/local/bin/fe-entrypoint.sh
RUN chmod +x /usr/local/bin/fe-entrypoint.sh

EXPOSE 80
ENTRYPOINT ["/usr/local/bin/fe-entrypoint.sh"]
