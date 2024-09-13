FROM oven/bun:alpine AS builder

WORKDIR /app

# Copy everything
COPY . .

# Install packages as in package-lock
RUN bun install --frozen-lock-file

# Build
RUN bun run build

# Remove packages
RUN rm -rf node_modules

# Install prod packages
RUN bun install --frozen-lock-file --omit=dev --omit=optional

FROM oven/bun:alpine AS production

# Add user and group
RUN addgroup -g 2000 -S appgroup
RUN adduser -DH -s /sbin/nologin -u 2000 -G appgroup -S appuser

# Set workdir
WORKDIR /app

# Secrets
RUN --mount=type=secret,id=CLOUDFLARE_ORIGIN_CERTIFICATE,target=/etc/ssl/easyflow.pem \
    --mount=type=secret,id=CLOUDFLARE_ORIGIN_CA_KEY,target=/etc/ssl/easyflow.key \
    echo "Secrets loaded"

# Copy needed files
COPY --chown=appuser:appgroup --from=builder /app/.next /app/.next
COPY --chown=appuser:appgroup --from=builder /app/node_modules /app/node_modules
COPY --chown=appuser:appgroup --from=builder /app/public /app/public
COPY --chown=appuser:appgroup --from=builder /app/entrypoint.sh /app/entrypoint.sh
COPY --chown=appuser:appgroup --from=builder /app/next.config.mjs /app/next.config.mjs
COPY --chown=appuser:appgroup --from=builder /app/nginx.conf /etc/nginx/nginx.conf

# add nginx
RUN apk add nginx

# Create the necessary directories with correct permissions
RUN mkdir -p /var/ /run/ /logs/ && \
    chown -R appuser:appgroup /var/ /run/ /logs/

USER appuser

LABEL org.opencontainers.image.authors="nico.benninger43@gmail.com"
LABEL org.opencontainers.image.source="https://github.com/easyflow-chat/easyflow-frontend"
LABEL org.opencontainers.image.title="Easyflow Frontend"
LABEL org.opencontainers.image.description="Frontend for Easyflow chat application"

ENV APPLICATION_ROOT="/app"
ENV NODE_ENV="production"

RUN chmod +x ./entrypoint.sh
ENTRYPOINT ["./entrypoint.sh"]