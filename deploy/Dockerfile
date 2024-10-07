FROM node:20.18.0-slim as production

WORKDIR /app

ENV NODE_ENV production

COPY --chown=node:node --from=build /app/dist ./dist
COPY --chown=node:node --from=build /app/node_modules ./node_modules

CMD ["node", "dist/main.js"]