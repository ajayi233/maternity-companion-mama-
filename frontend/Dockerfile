FROM node:18-alpine

RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 4173

CMD ["npm", "run", "preview", "--", "--host"]