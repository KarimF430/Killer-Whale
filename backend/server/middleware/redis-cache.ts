import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';

/**
 * Redis Cache Middleware for 1M+ Users
 * Production-ready distributed caching
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

const tlsOpt = process.env.REDIS_TLS === 'true' ? { tls: {} as Record<string, unknown> } : {};

let redis: Redis | null = null;
if (useUrl || hasHost) {
  redis = useUrl
    ? new Redis(process.env.REDIS_URL as string, { ...commonOpts, ...tlsOpt })
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
  console.log('ℹ️ Redis not configured (set REDIS_URL or REDIS_HOST). Caching and rate-limit store disabled.');
}

/**
 * Cache Middleware Factory with Redis
 */
export function redisCacheMiddleware(ttl: number = 300) {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Skip entirely if Redis is not configured
    if (!redis) {
      return next();
    }

    // Generate cache key from URL and query params
    const cacheKey = `cache:${req.path}:${JSON.stringify(req.query)}`;

    try {
      // Try to get from cache
      const cachedData = await redis.get(cacheKey);
      
      if (cachedData) {
        console.log(`✅ Redis Cache HIT: ${cacheKey}`);
        const data = JSON.parse(cachedData);
        
        // Add cache headers
        res.set('X-Cache', 'HIT');
        res.set('X-Cache-TTL', ttl.toString());
        
        return res.json(data);
      }

      console.log(`❌ Redis Cache MISS: ${cacheKey}`);
      
      // Store original res.json
      const originalJson = res.json.bind(res);

      // Override res.json to cache the response
      res.json = function(data: any) {
        // Cache the response asynchronously
        if (redis) {
          redis.setex(cacheKey, ttl, JSON.stringify(data))
            .catch(err => console.error('Redis cache set error:', err));
        }
        
        // Add cache headers
        res.set('X-Cache', 'MISS');
        res.set('X-Cache-TTL', ttl.toString());
        
        return originalJson(data);
      };

      next();
    } catch (error) {
      console.error('Redis middleware error:', error);
      // If Redis fails, continue without caching
      next();
    }
  };
}

/**
 * Invalidate cache for specific patterns
 */
export async function invalidateRedisCache(pattern: string): Promise<void> {
  try {
    if (!redis) return;
    const keys = await redis.keys(`cache:${pattern}*`);
    if (keys.length > 0) {
      await redis.del(...keys);
      console.log(`🗑️ Redis cache invalidated: ${keys.length} keys matching ${pattern}`);
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
 * Get cache statistics
 */
export async function getRedisCacheStats() {
  try {
    if (!redis) {
      return { connected: false, totalKeys: 0 };
    }
    const info = await redis.info('stats');
    const dbSize = await redis.dbsize();
    
    // Parse Redis info
    const stats: any = {};
    info.split('\r\n').forEach(line => {
      const [key, value] = line.split(':');
      if (key && value) {
        stats[key] = value;
      }
    });
    
    return {
      connected: redis.status === 'ready',
      totalKeys: dbSize,
      hitRate: stats.keyspace_hit_rate || 'N/A',
      totalConnections: stats.total_connections_received || 0,
      totalCommands: stats.total_commands_processed || 0,
      usedMemory: stats.used_memory_human || 'N/A'
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
      console.warn('Skipping Redis cache warmup: Redis not configured');
      return;
    }
    console.log('🔥 Warming up Redis cache...');
    
    // Cache brands
    const brands = await storage.getBrands();
    await redis.setex('cache:/api/brands:{}', CacheTTL.BRANDS, JSON.stringify(brands));
    
    // Cache popular models
    const models = await storage.getModels();
    const popularModels = models.filter((m: any) => m.isPopular);
    await redis.setex('cache:/api/models:{"popular":"true"}', CacheTTL.MODELS, JSON.stringify(popularModels));
    
    console.log('✅ Cache warmed up successfully');
  } catch (error) {
    console.error('Cache warmup error:', error);
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

// Export Redis client for direct use if needed
export { redis };
