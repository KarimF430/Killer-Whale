import Redis from 'ioredis';

/**
 * Unified Redis Configuration
 * Single Redis client instance for both sessions and caching
 * Provides robust error handling and reconnection strategies
 */

// Redis client instance (singleton)
let redisClient: Redis | null = null;
let isConnecting = false;
let connectionAttempts = 0;
const MAX_CONNECTION_ATTEMPTS = 5;

/**
 * Create and configure Redis client
 */
function createRedisClient(): Redis | null {
    const useUrl = !!process.env.REDIS_URL;
    const hasHost = !!process.env.REDIS_HOST;

    if (!useUrl && !hasHost) {
        console.log('ℹ️  Redis not configured (set REDIS_URL or REDIS_HOST). Running without Redis.');
        return null;
    }

    // Common configuration options
    const commonOpts = {
        maxRetriesPerRequest: 3,
        enableOfflineQueue: false,
        lazyConnect: true, // Don't crash server if Redis fails on startup
        showFriendlyErrorStack: true,
        keepAlive: 30000, // Keep connection alive with 30s ping
        family: 4, // Use IPv4 (Render + Upstash compatibility)

        // Exponential backoff retry strategy
        retryStrategy: (times: number) => {
            if (times > MAX_CONNECTION_ATTEMPTS) {
                console.error(`❌ Redis connection failed after ${MAX_CONNECTION_ATTEMPTS} attempts. Giving up.`);
                return null; // Stop retrying
            }
            const delay = Math.min(times * 100, 3000); // Max 3s delay
            console.log(`⏳ Redis retry attempt ${times} in ${delay}ms...`);
            return delay;
        },

        // Reconnect on specific errors
        reconnectOnError: (err: Error) => {
            const targetErrors = ['READONLY', 'ECONNRESET', 'ETIMEDOUT', 'EPIPE'];
            const shouldReconnect = targetErrors.some(errType =>
                err.message.includes(errType)
            );

            if (shouldReconnect) {
                console.log(`🔄 Reconnecting due to error: ${err.message}`);
                return true;
            }
            return false;
        },
    };

    // TLS configuration for production
    const tlsOpt = process.env.REDIS_TLS === 'true' ? {
        tls: {
            rejectUnauthorized: false, // Required for Upstash and some cloud providers
            minVersion: 'TLSv1.2' as const,
        }
    } : {};

    try {
        const client = useUrl
            ? new Redis(process.env.REDIS_URL as string, {
                ...commonOpts,
                ...tlsOpt,
            })
            : new Redis({
                host: process.env.REDIS_HOST as string,
                port: parseInt(process.env.REDIS_PORT || '6379'),
                password: process.env.REDIS_PASSWORD,
                ...commonOpts,
                ...tlsOpt,
            });

        // Setup event handlers
        setupEventHandlers(client);

        return client;
    } catch (error) {
        console.error('❌ Failed to create Redis client:', error);
        return null;
    }
}

/**
 * Setup Redis event handlers for connection lifecycle
 */
function setupEventHandlers(client: Redis) {
    client.on('connect', () => {
        console.log('🔌 Redis connecting...');
        connectionAttempts = 0; // Reset on successful connection
    });

    client.on('ready', () => {
        console.log('✅ Redis connected and ready');
        isConnecting = false;
    });

    client.on('error', (err) => {
        // Filter out common non-critical errors
        const isCritical = !err.message.includes('ECONNREFUSED') &&
            !err.message.includes('ETIMEDOUT');

        if (isCritical) {
            console.error('❌ Redis error:', err.message);
        } else {
            console.warn('⚠️  Redis connection issue:', err.message);
        }
    });

    client.on('close', () => {
        console.log('🔌 Redis connection closed');
    });

    client.on('reconnecting', (delay: number) => {
        connectionAttempts++;
        console.log(`🔄 Redis reconnecting in ${delay}ms (attempt ${connectionAttempts})...`);
    });

    client.on('end', () => {
        console.log('🔚 Redis connection ended');
        isConnecting = false;
    });
}

/**
 * Get Redis client instance (singleton pattern)
 */
export function getRedisClient(): Redis | null {
    if (!redisClient && !isConnecting) {
        isConnecting = true;
        redisClient = createRedisClient();

        if (redisClient) {
            // Connect in background - don't block server startup
            redisClient.connect().catch(err => {
                console.error('❌ Redis initial connection failed:', err.message);
                console.warn('⚠️  Continuing without Redis. Sessions will use memory store.');
                redisClient = null;
                isConnecting = false;
            });
        } else {
            isConnecting = false;
        }
    }

    return redisClient;
}

/**
 * Check if Redis is connected and ready
 */
export function isRedisReady(): boolean {
    return redisClient?.status === 'ready';
}

/**
 * Gracefully close Redis connection
 */
export async function closeRedisConnection(): Promise<void> {
    if (redisClient) {
        try {
            await redisClient.quit();
            console.log('✅ Redis connection closed gracefully');
        } catch (error) {
            console.error('❌ Error closing Redis connection:', error);
            // Force disconnect if graceful quit fails
            redisClient.disconnect();
        } finally {
            redisClient = null;
            isConnecting = false;
        }
    }
}

/**
 * Get Redis client for session store (compatible with connect-redis)
 * Returns a client that can be used with RedisStore
 */
export function getSessionRedisClient(): Redis | null {
    return getRedisClient();
}

/**
 * Get Redis client for caching
 */
export function getCacheRedisClient(): Redis | null {
    return getRedisClient();
}

// Export the singleton instance getter as default
export default getRedisClient;
