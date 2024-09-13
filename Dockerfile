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

# Copy needed files (not needed files in .dockerignore)
COPY --chown=appuser:appgroup . /app/

# add nginx
RUN apk add nginx

# Create the necessary directories with correct permissions for nginx
RUN mkdir -p /var/ /run/ /logs/ && \
    chown -R appuser:appgroup /var/ /run/ /logs/

LABEL org.opencontainers.image.authors="nico.benninger43@gmail.com"
LABEL org.opencontainers.image.source="https://github.com/easyflow-chat/easyflow-frontend"
LABEL org.opencontainers.image.title="Easyflow Frontend"
LABEL org.opencontainers.image.description="Frontend for Easyflow chat application"

ENV APPLICATION_ROOT="/app"
ENV NODE_ENV="production"

RUN chmod +x ./entrypoint.sh
ENTRYPOINT ["./entrypoint.sh"]