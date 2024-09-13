FROM oven/bun:alpine AS production

# Secrets
RUN --mount=type=secret,id=origin_certificate,target=/etc/ssl/easyflow.pem \
    --mount=type=secret,id=origin_key,target=/etc/ssl/easyflow.key \
    echo "Secrets loaded"

# Add user and group
RUN addgroup -g 2000 -S appgroup
RUN adduser -DH -s /sbin/nologin -u 2000 -G appgroup -S appuser

# Set workdir
WORKDIR /app

# Copy needed files
COPY --chown=appuser:appgroup ./.next /app/.next
COPY --chown=appuser:appgroup ./node_modules /app/node_modules
COPY --chown=appuser:appgroup ./public /app/public
COPY --chown=appuser:appgroup ./entrypoint.sh /app/entrypoint.sh
COPY --chown=appuser:appgroup ./next.config.mjs /app/next.config.mjs
COPY --chown=appuser:appgroup ./nginx.conf /etc/nginx/nginx.conf

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