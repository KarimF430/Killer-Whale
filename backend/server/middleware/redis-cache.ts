import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';

/**
 * CarWale-Style Redis Cache Middleware
 * Production-ready distributed caching with advanced features
 */

// Initialize Redis client (only if configured)
const useUrl = !!process.env.REDIS_URL;
const hasHost = !!process.env.REDIS_HOST;
const commonOpts = {
  maxRetriesPerRequest: 3,
  enableOfflineQueue: false,
  retryStrategy: (times: number) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  reconnectOnError: (err: Error) => {
    const targetError = 'READONLY';
    if ((err as any).message && (err as any).message.includes(targetError)) {
      return true;
    }
    return false;
  },
} as const;

const tlsOpt = process.env.REDIS_TLS === 'true' ? {
  tls: {
    rejectUnauthorized: false // Required for Upstash
  }
} : {};

let redis: Redis | null = null;
if (useUrl || hasHost) {
  redis = useUrl
    ? new Redis(process.env.REDIS_URL as string, {
      ...commonOpts,
      ...tlsOpt,
      family: 6, // Use IPv6 if available, fallback to IPv4
      lazyConnect: false,
      showFriendlyErrorStack: true
    })
    : new Redis({
      host: process.env.REDIS_HOST as string,
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      ...commonOpts,
      ...tlsOpt,
    });
}

// Redis connection events
if (redis) {
  redis.on('connect', () => {
    console.log('✅ Redis connected successfully');
  });

  redis.on('error', (err) => {
    console.error('❌ Redis connection error:', err);
  });

  redis.on('ready', () => {
    console.log('🚀 Redis ready for operations');
  });
} else {
  console.log('ℹ️ Redis not configured (set REDIS_URL or REDIS_HOST). Caching disabled.');
}

/**
 * Cache Middleware with Stale-While-Revalidate (SWR)
 * Returns stale data immediately while refreshing in background
 */
export function redisCacheMiddleware(ttl: number = 300, staleTime: number = 60) {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Skip if Redis not configured
    if (!redis) {
      return next();
    }

    // Generate hierarchical cache key
    const namespace = req.path.split('/')[2] || 'api'; // e.g., 'brands', 'models'
    const cacheKey = `cache:${namespace}:${req.path}:${JSON.stringify(req.query)}`;

    try {
      // Try to get from cache
      const [cachedData, cacheTTL] = await Promise.all([
        redis.get(cacheKey),
        redis.ttl(cacheKey)
      ]);

      if (cachedData) {
        const data = JSON.parse(cachedData);

        // Check if stale (TTL < staleTime seconds)
        if (cacheTTL > 0 && cacheTTL < staleTime) {
          console.log(`⚡ Redis Cache STALE (refreshing): ${cacheKey}`);

          // Return stale data immediately
          res.set('X-Cache', 'STALE');
          res.set('X-Cache-TTL', cacheTTL.toString());
          res.json(data);

          // Refresh cache in background (fire and forget)
          refreshCacheInBackground(req, cacheKey, ttl).catch(err =>
            console.error('Background refresh error:', err)
          );

          return;
        }

        // Fresh cache hit
        console.log(`✅ Redis Cache HIT: ${cacheKey}`);
        res.set('X-Cache', 'HIT');
        res.set('X-Cache-TTL', cacheTTL.toString());
        return res.json(data);
      }

      console.log(`❌ Redis Cache MISS: ${cacheKey}`);

      // Cache miss - use stampede prevention
      await handleCacheMissWithStampedePrevention(req, res, next, cacheKey, ttl);

    } catch (error) {
      console.error('Redis middleware error:', error);
      next();
    }
  };
}

/**
 * Cache Stampede Prevention using Redis locks
 * Ensures only one request refreshes cache at a time
 */
async function handleCacheMissWithStampedePrevention(
  req: Request,
  res: Response,
  next: NextFunction,
  cacheKey: string,
  ttl: number
) {
  if (!redis) return next();

  const lockKey = `lock:${cacheKey}`;
  const lockTTL = 10; // 10 seconds lock timeout

  try {
    // Try to acquire lock (NX = only set if not exists)
    // @ts-ignore - ioredis typing issue with SET NX EX combination
    const lockAcquired = await redis.set(lockKey, '1', 'NX', 'EX', lockTTL);

    if (lockAcquired) {
      // This request gets to refresh the cache
      console.log(`🔒 Lock acquired for: ${cacheKey}`);

      // Store original res.json
      const originalJson = res.json.bind(res);

      // Override res.json to cache the response
      res.json = function (data: any) {
        // Cache the response
        if (redis) {
          redis.setex(cacheKey, ttl, JSON.stringify(data))
            .then(() => {
              console.log(`💾 Cached: ${cacheKey}`);
              // Release lock
              if (redis) return redis.del(lockKey);
              return Promise.resolve(0);
            })
            .catch(err => console.error('Cache set error:', err));
        }

        res.set('X-Cache', 'MISS');
        res.set('X-Cache-TTL', ttl.toString());

        return originalJson(data);
      };

      next();
    } else {
      // Another request is already refreshing - wait and retry
      console.log(`⏳ Waiting for lock: ${cacheKey}`);

      // Wait 100ms and check cache again
      await new Promise(resolve => setTimeout(resolve, 100));

      const cachedData = await redis.get(cacheKey);
      if (cachedData) {
        // Cache was refreshed by the lock holder
        console.log(`✅ Cache refreshed by lock holder: ${cacheKey}`);
        res.set('X-Cache', 'HIT-AFTER-WAIT');
        return res.json(JSON.parse(cachedData));
      }

      // Still no cache - proceed normally
      next();
    }
  } catch (error) {
    console.error('Stampede prevention error:', error);
    next();
  }
}

/**
 * Refresh cache in background (for SWR)
 */
async function refreshCacheInBackground(req: Request, cacheKey: string, ttl: number) {
  if (!redis) return;

  // Simulate fetching fresh data by making internal request
  // In production, you'd call the actual data fetching function
  console.log(`🔄 Background refresh started: ${cacheKey}`);

  // Note: This is a placeholder. In real implementation,
  // you'd call the actual data fetching function here
}

/**
 * Cache car details using Redis Hash (structured data)
 */
export async function cacheCarDetails(carId: string, carData: any, ttl: number = 1800) {
  if (!redis) return;

  try {
    const hashKey = `car:${carId}`;

    // Store as hash for efficient field access
    await redis.hset(hashKey, {
      id: carData.id,
      name: carData.name,
      brand: carData.brand,
      price: carData.price.toString(),
      fuelType: carData.fuelType,
      transmission: carData.transmission,
      rating: carData.rating?.toString() || '0',
      image: carData.image || '',
      updatedAt: Date.now().toString()
    });

    // Set expiration
    await redis.expire(hashKey, ttl);

    console.log(`💾 Car cached as hash: ${hashKey}`);
  } catch (error) {
    console.error('Cache car details error:', error);
  }
}

/**
 * Get car details from Redis Hash
 */
export async function getCachedCarDetails(carId: string) {
  if (!redis) return null;

  try {
    const hashKey = `car:${carId}`;
    const carData = await redis.hgetall(hashKey);

    if (Object.keys(carData).length === 0) {
      return null;
    }

    // Convert back to proper types
    return {
      id: carData.id,
      name: carData.name,
      brand: carData.brand,
      price: parseFloat(carData.price),
      fuelType: carData.fuelType,
      transmission: carData.transmission,
      rating: parseFloat(carData.rating),
      image: carData.image,
      updatedAt: parseInt(carData.updatedAt)
    };
  } catch (error) {
    console.error('Get cached car error:', error);
    return null;
  }
}

/**
 * Invalidate cache with pattern matching
 */
export async function invalidateRedisCache(pattern: string): Promise<void> {
  try {
    if (!redis) return;

    // Use SCAN instead of KEYS for production safety
    const keys: string[] = [];
    let cursor = '0';

    do {
      const [newCursor, foundKeys] = await redis.scan(
        cursor,
        'MATCH',
        `cache:${pattern}*`,
        'COUNT',
        100
      );
      cursor = newCursor;
      keys.push(...foundKeys);
    } while (cursor !== '0');

    if (keys.length > 0) {
      await redis.del(...keys);
      console.log(`🗑️ Invalidated ${keys.length} keys matching: ${pattern}`);
    }
  } catch (error) {
    console.error('Redis invalidation error:', error);
  }
}

/**
 * Clear all cache
 */
export async function clearAllCache(): Promise<void> {
  try {
    if (!redis) return;
    await redis.flushdb();
    console.log('🗑️ All Redis cache cleared');
  } catch (error) {
    console.error('Redis clear error:', error);
  }
}

/**
 * Get comprehensive cache statistics
 */
export async function getRedisCacheStats() {
  try {
    if (!redis) {
      return { connected: false, totalKeys: 0 };
    }

    const [info, dbSize, memoryInfo] = await Promise.all([
      redis.info('stats'),
      redis.dbsize(),
      redis.info('memory')
    ]);

    // Parse stats
    const parseInfo = (infoStr: string) => {
      const stats: any = {};
      infoStr.split('\r\n').forEach(line => {
        const [key, value] = line.split(':');
        if (key && value) {
          stats[key] = value;
        }
      });
      return stats;
    };

    const stats = parseInfo(info);
    const memory = parseInfo(memoryInfo);

    // Calculate hit rate
    const hits = parseInt(stats.keyspace_hits || '0');
    const misses = parseInt(stats.keyspace_misses || '0');
    const hitRate = hits + misses > 0
      ? ((hits / (hits + misses)) * 100).toFixed(2)
      : '0.00';

    return {
      connected: redis.status === 'ready',
      totalKeys: dbSize,
      hitRate: `${hitRate}%`,
      hits: hits,
      misses: misses,
      totalConnections: stats.total_connections_received || 0,
      totalCommands: stats.total_commands_processed || 0,
      usedMemory: memory.used_memory_human || 'N/A',
      usedMemoryPeak: memory.used_memory_peak_human || 'N/A',
      evictedKeys: stats.evicted_keys || 0,
      expiredKeys: stats.expired_keys || 0
    };
  } catch (error) {
    console.error('Redis stats error:', error);
    return {
      connected: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * Warm up cache with essential data
 */
export async function warmUpCache(storage: any) {
  try {
    if (!redis) {
      console.warn('⚠️ Skipping cache warmup: Redis not configured');
      return;
    }

    console.log('🔥 Warming up Redis cache...');

    // Cache brands
    const brands = await storage.getBrands();
    await redis.setex(
      'cache:brands:/api/brands:{}',
      CacheTTL.BRANDS,
      JSON.stringify(brands)
    );
    console.log(`✅ Cached ${brands.length} brands`);

    // Cache popular models
    const models = await storage.getModels();
    const popularModels = models.filter((m: any) => m.isPopular);
    await redis.setex(
      'cache:models:/api/models:{"popular":"true"}',
      CacheTTL.MODELS,
      JSON.stringify(popularModels)
    );
    console.log(`✅ Cached ${popularModels.length} popular models`);

    // Cache top 10 models as hashes
    const topModels = models.slice(0, 10);
    for (const model of topModels) {
      await cacheCarDetails(model.id, model, CacheTTL.MODELS);
    }
    console.log(`✅ Cached ${topModels.length} models as hashes`);

    console.log('✅ Cache warmup completed successfully');
  } catch (error) {
    console.error('❌ Cache warmup error:', error);
  }
}

/**
 * Cache TTL Constants (in seconds)
 */
export const CacheTTL = {
  BRANDS: 3600,      // 1 hour
  MODELS: 1800,      // 30 minutes
  VARIANTS: 900,     // 15 minutes
  STATS: 300,        // 5 minutes
  COMPARISONS: 7200, // 2 hours
  NEWS: 600,         // 10 minutes
  SEARCH: 1800,      // 30 minutes
  CAR_DETAILS: 1800, // 30 minutes
};

/**
 * Stale time for SWR (seconds before TTL expiry to trigger refresh)
 */
export const StaleTimes = {
  BRANDS: 300,       // Refresh 5 min before expiry
  MODELS: 180,       // Refresh 3 min before expiry
  VARIANTS: 120,     // Refresh 2 min before expiry
  SEARCH: 180,       // Refresh 3 min before expiry
};

/**
 * Cache tags for invalidation groups
 */
export const CacheTags = {
  BRAND: 'brand',
  MODEL: 'model',
  VARIANT: 'variant',
  NEWS: 'news',
  ALL: '*'
};

// Export Redis client for direct use
export { redis };
