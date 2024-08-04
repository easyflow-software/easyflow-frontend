FROM node:22-alpine AS builder

WORKDIR /app

# Copy everything
COPY . .

# Install packages as in package-lock
RUN npm ci

# Linting
RUN npm run lint

# Build
RUN npm run build

# Remove packages
RUN rm -rf node_modules

# Install prod packages
RUN npm ci --omit=dev --omit=optional

FROM node:22-alpine AS production

# Secrets
ARG CLOUDFLARE_ORIGIN_CERTIFICATE
ARG CLOUDFLARE_ORIGIN_CA_KEY

# Uninstall yarn not needed in prod (npm is needed for npx next start in the entrypoint)
RUN npm uninstall -g yarn

RUN addgroup -g 2000 -S appgroup
RUN adduser -DH -s /sbin/nologin -u 2000 -G appgroup -S appuser


WORKDIR /app

# Copy needed files
COPY --chown=appuser:appgroup --from=builder /app/.next /app/.next
COPY --chown=appuser:appgroup --from=builder /app/node_modules /app/node_modules
COPY --chown=appuser:appgroup --from=builder /app/public /app/public
COPY --chown=appuser:appgroup --from=builder /app/entrypoint.sh /app/entrypoint.sh
COPY --chown=appuser:appgroup --from=builder /app/next.config.mjs /app/next.config.mjs
COPY --chown=appuser:appgroup --from=builder /app/nginx.conf /etc/nginx/nginx.conf

# Set type module
RUN echo '{"type": "module"}' > /app/package.json

# Cloudflare origin certificate
RUN echo "$CLOUDFLARE_ORIGIN_CERTIFICATE" > /etc/ssl/easyflow.pem
RUN echo "$CLOUDFLARE_ORIGIN_CA_KEY" > /etc/ssl/easyflow.key
RUN chown -R appuser:appgroup /etc/ssl/

# add nginx
RUN apk add nginx

# Create the necessary directories with correct permissions
RUN mkdir -p /var/ /run/ /logs/ && \
    chown -R appuser:appgroup /var/ /run/ /logs/

USER appuser

LABEL org.opencontainers.image.authors="nico.benninger43@gmail.com"
LABEL org.opencontainers.image.source="https://github.com/easyflow-chat/easyflow-backend"
LABEL org.opencontainers.image.title="Easyflow Frontend"
LABEL org.opencontainers.image.description="Backend for Easyflow chat application"

ENV APPLICATION_ROOT="/app"
ENV NODE_ENV="production"

RUN chmod +x ./entrypoint.sh
ENTRYPOINT ["./entrypoint.sh"]