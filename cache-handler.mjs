import { createClient } from 'redis';

import { CacheHandler } from '@neshca/cache-handler';
import createLruCache from '@neshca/cache-handler/local-lru';
import createRedisCache from '@neshca/cache-handler/redis-strings';

CacheHandler.onCreation(async () => {
  const localCache = createLruCache({
    maxItemsNumber: 10000,
    maxItemSizeBytes: 1024 * 1024 * 250, // Limit to 250 MB
  });

  let redisCache;
  if (!process.env.REDIS_URL) {
    console.warn('REDIS_URL env is not set, using local cache only.');
  } else {
    try {
      let isReady = false;

      const client = createClient({
        url: process.env.REDIS_URL,
        socket: {
          reconnectStrategy: () => (isReady ? 5000 : false),
        },
      });

      client.on('error', error => {
        console.error('Redis error', error);
      });

      client.on('ready', () => {
        isReady = true;
      });

      await client.connect();

      redisCache = createRedisCache({
        client,
        keyPrefix: `next-shared-cache-${process.env.GIT_HASH}:`,
        // timeout for the Redis client operations like `get` and `set`
        // after this timeout, the operation will be considered failed and the `localCache` will be used
        timeoutMs: 5000,
      });
    } catch (error) {
      console.warn('Failed to initialize Redis cache, using local cache only.', error);
    }
  }

  return {
    handlers: [redisCache, localCache],
    ttl: {
      // This value is also used as revalidation time for every ISR site
      defaultStaleAge: process.env.NEXT_PUBLIC_CACHE_IN_SECONDS,
      // This makes sure, that resources without set revalidation time aren't stored infinitely in Redis
      estimateExpireAge: staleAge => staleAge,
    },
  };
});

export default CacheHandler;
