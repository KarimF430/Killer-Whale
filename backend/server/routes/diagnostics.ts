import express, { Router } from 'express';
import { redis } from '../middleware/redis-cache';

const router = Router();

/**
 * System Diagnostics
 * GET /api/diagnostics
 */
router.get('/', async (req, res) => {
    const isProd = process.env.NODE_ENV === 'production';

    // Check Redis Cache Connection
    let redisCacheStatus = 'disconnected';
    try {
        if (redis) {
            await redis.ping();
            redisCacheStatus = 'connected';
        }
    } catch (e) {
        redisCacheStatus = 'error';
    }

    // Check Session Store (Redis)
    // We can't easily check the session store client directly here as it's in index.ts scope,
    // but we can check if the session middleware is working by checking req.session
    const sessionStatus = req.session ? 'active' : 'inactive';
    const sessionID = req.sessionID;

    const diagnostics = {
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        trustProxy: req.app.get('trust proxy'),
        redis: {
            cache: redisCacheStatus,
            url_configured: !!process.env.REDIS_URL,
            host_configured: !!process.env.REDIS_HOST
        },
        session: {
            status: sessionStatus,
            id: sessionID,
            cookie: req.session?.cookie
        },
        cookies: {
            secure: isProd,
            sameSite: isProd ? 'none' : 'lax',
            domain: isProd ? undefined : undefined
        },
        headers: {
            host: req.get('host'),
            origin: req.get('origin'),
            'x-forwarded-proto': req.get('x-forwarded-proto'),
            'x-forwarded-for': req.get('x-forwarded-for')
        }
    };

    res.json(diagnostics);
});

export default router;
