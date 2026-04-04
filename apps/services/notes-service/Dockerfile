FROM node:20-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile --prod
COPY . .
RUN pnpm build
EXPOSE 3003
CMD ["node", "dist/main"]
