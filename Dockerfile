FROM node:20-alpine AS base

RUN npm i -g pnpm

FROM base AS dependencies

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

FROM base AS build

WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN npx prisma generate
RUN pnpm build
RUN pnpm prune --prod

FROM base AS deploy

ARG APP
WORKDIR /app
COPY --from=build /app/dist/apps/$APP ./dist
COPY --from=build /app/node_modules ./node_modules

CMD ["node", "dist/main"]