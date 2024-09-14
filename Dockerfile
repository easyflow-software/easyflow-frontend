FROM oven/bun:alpine AS production

# Add user and group
RUN addgroup -g 2000 -S appgroup
RUN adduser -DH -s /sbin/nologin -u 2000 -G appgroup -S appuser

# Set workdir
WORKDIR /app

# Copy needed files (not needed files in .dockerignore)
COPY --chown=appuser:appgroup ./.next /app/.next
COPY --chown=appuser:appgroup ./node_modules /app/node_modules
COPY --chown=appuser:appgroup ./public /app/public
COPY --chown=appuser:appgroup ./entrypoint.sh /app/entrypoint.sh
COPY --chown=appuser:appgroup ./next.config.mjs /app/next.config.mjs
COPY --chown=appuser:appgroup ./nginx.conf /app/nginx.conf
COPY --chown=appuser:appgroup ./package.json /app/package.json

# add nginx
RUN apk add nginx

# Create the necessary directories with correct permissions for nginx
RUN mkdir -p /var/ /run/ /logs/ && \
    chown -R appuser:appgroup /var/ /run/ /logs/

ENV APPLICATION_ROOT="/app"
ENV NODE_ENV="production"

RUN chmod +x ./entrypoint.sh
ENTRYPOINT ["./entrypoint.sh"]