FROM node:22-alpine AS production

# Add user and group
RUN addgroup -g 2000 -S appgroup
RUN adduser -DH -s /sbin/nologin -u 2000 -G appgroup -S appuser

# remove yarn and npm
RUN npm uninstall -g yarn
RUN npm uninstall -g npm

# Set workdir
WORKDIR /app

# Copy needed files (not needed files in .dockerignore)
COPY --chown=appuser:appgroup ./.next/standalone/ /app/standalone
COPY --chown=appuser:appgroup ./.next/static /app/standalone/.next/static
COPY --chown=appuser:appgroup ./public /app/standalone/public
COPY --chown=appuser:appgroup ./entrypoint.sh /app/entrypoint.sh
COPY --chown=appuser:appgroup ./next.config.mjs /app/next.config.mjs
COPY --chown=appuser:appgroup ./nginx.conf /app/nginx.conf

ENV APPLICATION_ROOT="/app"

RUN chmod +x ./entrypoint.sh
ENTRYPOINT ["./entrypoint.sh"]