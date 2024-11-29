FROM node:22-alpine AS production

# Add user and group
RUN addgroup -g 2000 -S appgroup
RUN adduser -DH -s /sbin/nologin -u 2000 -G appgroup -S appuser

# remove yarn
RUN npm uninstall -g yarn

# Set workdir
WORKDIR /app

# Copy needed files (not needed files in .dockerignore)
COPY --chown=appuser:appgroup ./.next/standalone/ /app/.next/standalone
COPY --chown=appuser:appgroup ./.next/static/ /app/.next/standalone/static
COPY --chown=appuser:appgroup ./.next/cache/fetch-cache/ /app/.next/standalone/.next/cache/fetch-chache
COPY --chown=appuser:appgroup ./public /app/.next/standalone/public
COPY --chown=appuser:appgroup ./entrypoint.sh /app/entrypoint.sh
COPY --chown=appuser:appgroup ./next.config.mjs /app/next.config.mjs
COPY --chown=appuser:appgroup ./nginx.conf /app/nginx.conf

# add nginx
RUN apk add nginx

# Create the necessary directories with correct permissions for nginx
RUN mkdir -p /var/ /run/ /logs/ && \
    chown -R appuser:appgroup /var/ /run/ /logs/

ENV APPLICATION_ROOT="/app"

RUN chmod +x ./entrypoint.sh
ENTRYPOINT ["./entrypoint.sh"]