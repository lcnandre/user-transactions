# ========================================================
# Builder for the app
# ========================================================
FROM node:18-alpine AS base
FROM base AS builder

USER 0
WORKDIR /app
ENV NODE_ENV=production

COPY . .

ARG APP_PORT=3000
ARG DB_NAME

# Standard Node build tools for C++ dependencies
RUN apk add --no-cache make gcc g++ py3-pip
RUN npm install
RUN npm run build
RUN apk del make gcc g++ py3-pip

# Workaround for multi-stage copy
RUN chown -R 0:0 .
RUN chmod a+rX -R -c .

# ========================================================
# Production app
# ========================================================
FROM base AS production

USER 0

ENV NODE_ENV=production
ENV APP_PORT=${APP_PORT}
ENV DB_NAME=${DB_NAME}

WORKDIR /app
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/package-lock.json /app/package-lock.json
COPY --from=builder /app/node_modules /app/node_modules

RUN npm prune --production
# Workaround for broken multi-stage copy
RUN chown -R 0:0 .
RUN chmod a+rX -R -c .

EXPOSE ${APP_PORT}
ENTRYPOINT [ "node", "dist/src/main" ]
