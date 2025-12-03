import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { MongoDBStorage } from "./db/mongodb-storage";
import type { IStorage } from "./storage";
import { createBackupService } from "./backup-service";
import { newsStorage } from "./db/news-storage";
import monitoringRoutes from "./routes/monitoring";
import dotenv from "dotenv";
import helmet from "helmet";
import { apiLimiter } from "./middleware/rateLimiter";
import { botDetector, ddosShield } from "./middleware/security";
import { warmUpCache } from "./middleware/redis-cache";
import compression from "compression";
import pinoHttp from "pino-http";
import session from "express-session";
import { RedisStore } from "connect-redis";
import { init as sentryInit, setupExpressErrorHandler } from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables (force backend/.env to override any pre-set vars)
const rootEnv = path.resolve(process.cwd(), '.env');
const backendEnv = path.resolve(__dirname, '../.env');
dotenv.config({ path: rootEnv });
dotenv.config({ path: backendEnv, override: true });

// Initialize Sentry (only if DSN is configured)
const sentryEnabled = !!process.env.SENTRY_DSN;
if (sentryEnabled) {
  try {
    sentryInit({
      dsn: process.env.SENTRY_DSN,
      integrations: [
        nodeProfilingIntegration(),
      ],
      // Tracing
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      // Set sampling rate for profiling - this is relative to tracesSampleRate
      profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      environment: process.env.NODE_ENV || 'development',
    });
    console.log('✅ Sentry initialized');
  } catch (error) {
    console.error('⚠️ Failed to initialize Sentry:', error);
  }
} else {
  console.log('ℹ️ Sentry not configured (set SENTRY_DSN to enable error tracking)');
}

const app = express();

// Sentry v8+ handles request isolation automatically
// No need for requestHandler or tracingHandler

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));
app.use(cookieParser());
app.set("trust proxy", 1);
app.disable('x-powered-by');
app.use(pinoHttp({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  redact: {
    paths: ['req.headers.authorization', 'req.headers.cookie', 'res.headers.set-cookie'],
    remove: true,
  },
}));
app.use(compression());
const isProd = process.env.NODE_ENV === 'production';

// Build a production-safe, permissive CSP to support admin app uploads (R2/S3), images and APIs
const accountId = process.env.R2_ACCOUNT_ID;
const r2Endpoint = process.env.R2_ENDPOINT || (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : undefined);
const extraConnect: string[] = [
  process.env.FRONTEND_URL || '',
  process.env.NEXT_PUBLIC_API_URL || '',
  r2Endpoint || '',
].filter(Boolean) as string[];

app.use(helmet({
  // Disable CSP in development to allow dev toolchains (Vite/Next) to inject preambles
  contentSecurityPolicy: isProd
    ? {
      useDefaults: true,
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", 'https:', 'http:', ...extraConnect],
        imgSrc: ["'self'", 'data:', 'blob:', 'https:', 'http:'],
        mediaSrc: ["'self'", 'data:', 'blob:', 'https:', 'http:'],
        styleSrc: ["'self'", "'unsafe-inline'", 'https:'],
        scriptSrc: ["'self'", "'unsafe-inline'", 'https:'],
        frameSrc: ["'self'", 'https:'],
      },
    }
    : false,
  // COEP can interfere with dev HMR; disable in dev
  crossOriginEmbedderPolicy: isProd ? undefined : false,
  // Allow cross-origin embedding of resources (images) in development
  crossOriginResourcePolicy: isProd ? undefined : { policy: 'cross-origin' },
}));

// SECURE CORS configuration - MUST come before security middleware
const allowedOrigins = [
  'https://motoroctane.com',
  'https://www.motoroctane.com',
  'https://killer-whale101.vercel.app',
  'https://killer-whale.onrender.com',
  'http://localhost:3000',
  'http://localhost:5001',
  'http://192.168.1.23:3000',
  'http://192.168.1.23:5001',
  process.env.FRONTEND_URL,
  process.env.NEXT_PUBLIC_API_URL
].filter(Boolean);

app.use((req, res, next) => {
  const origin = req.headers.origin;

  // Only allow whitelisted origins
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  } else if (process.env.NODE_ENV === 'development') {
    // In development, allow localhost
    res.header('Access-Control-Allow-Origin', origin || '*');
    res.header('Access-Control-Allow-Credentials', 'true');
  }

  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cookie');
  res.header('Access-Control-Expose-Headers', 'RateLimit-Limit, RateLimit-Remaining, RateLimit-Reset, X-Cache, X-Cache-TTL');

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use('/api', apiLimiter);

// Serve uploaded files statically from a canonical path
const uploadsStaticPath = path.join(process.cwd(), 'uploads');

// Fallback: if a legacy .jpg/.png is requested but only a .webp exists, serve the .webp
app.get('/uploads/*', (req, res, next) => {
  try {
    const reqPath = req.path; // e.g., /uploads/image-123.jpg
    const relPath = reqPath.replace(/^\/+/, ''); // remove leading /
    const absPath = path.join(process.cwd(), relPath);
    fs.access(absPath, fs.constants.R_OK, (err) => {
      if (!err) return next(); // file exists; let static middleware handle it

      // If R2 public base is configured, redirect to it as a primary fallback
      const publicBase = process.env.R2_PUBLIC_BASE_URL;
      if (publicBase) {
        const target = `${publicBase}/${relPath}`;
        return res.redirect(302, target);
      }

      // Try .webp counterpart
      const webpRel = relPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      if (webpRel === relPath) return next();
      const webpAbs = path.join(process.cwd(), webpRel);
      fs.access(webpAbs, fs.constants.R_OK, (err2) => {
        if (!err2) {
          res.type('image/webp').sendFile(webpAbs);
        } else {
          next();
        }
      });
    });
  } catch {
    next();
  }
});
if (!isProd) {
  app.use(
    '/uploads',
    (req, res, next) => {
      res.setHeader('Cache-Control', 'no-store');
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
      next();
    },
    express.static(uploadsStaticPath, {
      etag: false,
      lastModified: false,
      maxAge: 0,
    })
  );
} else {
  app.use('/uploads', express.static(uploadsStaticPath));
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  const shouldCapture = process.env.NODE_ENV !== 'production';
  let capturedJsonResponse: string | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    if (shouldCapture) {
      try {
        const preview = JSON.stringify(bodyJson);
        capturedJsonResponse = preview.length > 200 ? preview.slice(0, 200) + '…' : preview;
      } catch { }
    }
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (shouldCapture && capturedJsonResponse) {
        logLine += ` :: ${capturedJsonResponse}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Redis Client for Sessions (unified configuration)
import { getSessionRedisClient, isRedisReady } from './config/redis-config';

const redisClient = getSessionRedisClient();

if (redisClient) {
  console.log('✅ Using unified Redis client for sessions');
} else {
  console.warn('⚠️  Redis not configured. Sessions will use memory store (not persistent across restarts)');
}

// Session Middleware with enhanced cross-domain support
const sessionConfig: any = {
  secret: process.env.SESSION_SECRET || "motoroctane_secret_key_2024",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: isProd, // true in production (required for sameSite: 'none')
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    sameSite: isProd ? 'none' : 'lax', // 'none' required for cross-domain OAuth
    domain: undefined, // Let browser handle domain automatically
    path: '/', // Explicitly set cookie path
  },
  name: 'sid', // Custom session ID name
  proxy: isProd, // Trust proxy in production for correct secure cookie handling
};

// Only use RedisStore if Redis client is available and connected
if (redisClient) {
  const redisStore = new RedisStore({
    client: redisClient,
    prefix: "sess:",
  });
  sessionConfig.store = redisStore;
  console.log('✅ Redis session store initialized');
} else {
  console.warn('⚠️  Using MemoryStore for sessions (fallback - not production-ready)');
}

app.use(session(sessionConfig));

console.log('✅ Session middleware configured');
console.log(`   - Environment: ${isProd ? 'production' : 'development'}`);
console.log(`   - Cookie secure: ${sessionConfig.cookie.secure}`);
console.log(`   - Cookie sameSite: ${sessionConfig.cookie.sameSite}`);
console.log(`   - Store: ${redisClient ? 'Redis (persistent)' : 'MemoryStore (fallback - sessions lost on restart)'}`);
console.log(`   - Trust proxy: ${sessionConfig.proxy}`);

// Debug middleware to log session info
if (!isProd) {
  app.use((req, res, next) => {
    if (req.path.includes('/auth/')) {
      console.log('🔍 Session Debug:', {
        sessionID: req.sessionID,
        userId: (req.session as any)?.userId,
        cookie: req.session?.cookie,
        path: req.path
      });
    }
    next();
  });
}

// Initialize services
(async () => {
  try {
    // Security: trusted proxies for cloud deployments
    if (isProd) {
      app.set('trust proxy', 1);
    }

    // Import and initialize Passport for OAuth
    const passportConfig = await import('./config/passport');
    const passport = passportConfig.default;

    // Initialize Passport middleware
    app.use(passport.initialize());
    app.use(passport.session());
    console.log('✅ Passport.js initialized for OAuth');

    // Initialize MongoDB storage
    const storage = new MongoDBStorage();
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/motoroctane";

    try {
      await storage.connect(mongoUri);
    } catch (error) {
      console.error('❌ Failed to connect to MongoDB. Please check:');
      console.error('   1. MongoDB is running (brew services start mongodb-community)');
      console.error('   2. MONGODB_URI in .env file is correct');
      console.error('   3. Network connection is available');
      console.error('   3. Network connection is available');
      console.warn('⚠️  Continuing without MongoDB (AI Chat will use mock data)...');
      // process.exit(1); // Don't exit, allow server to run for AI Chat
    }

    // Initialize news storage
    await newsStorage.initialize();

    // Warm up Redis cache for hot endpoints
    try {
      await warmUpCache(storage);
    } catch (e) {
      console.warn('Cache warmup skipped:', e instanceof Error ? e.message : e);
    }

    // Initialize backup service
    if (isProd) {
      const backupService = createBackupService(storage);
      backupService.startAutoBackup(30);
    }

    // Register monitoring routes (no auth required)
    app.use('/api/monitoring', monitoringRoutes);

    // Register cache management routes
    const cacheRoutes = (await import('./routes/cache')).default;
    app.use('/api/cache', cacheRoutes);

    // Register user authentication routes (public)
    const userAuthRoutes = (await import('./routes/user-auth')).default;
    app.use('/api/user', userAuthRoutes);
    console.log('✅ User authentication routes registered at /api/user');

    // Register admin user management routes
    const adminUsersRoutes = (await import('./routes/admin-users')).default;
    app.use('/api/admin/users', adminUsersRoutes);
    console.log('✅ Admin users routes registered at /api/admin/users');

    // Register diagnostics route
    const diagnosticsRoutes = (await import('./routes/diagnostics')).default;
    app.use('/api/diagnostics', diagnosticsRoutes);
    console.log('✅ Diagnostics routes registered at /api/diagnostics');

    // Register API routes FIRST before Vite
    registerRoutes(app, storage);


    const server = createServer(app);

    // Initialize Scheduled API Fetcher
    try {
      // Dynamic import to avoid circular dependencies if any
      // @ts-ignore
      const SchedulerIntegration = (await import('./schedulerIntegration')).default;
      const schedulerIntegration = new SchedulerIntegration(app);
      await schedulerIntegration.init();
      console.log('✅ Scheduled API fetcher initialized (1:00 PM & 8:00 PM IST)');
    } catch (error) {
      // console.error('❌ Failed to initialize scheduler:', error);
      console.warn('⚠️  Continuing without scheduler...');
    }

    // Initialize YouTube Scheduler
    try {
      const { startYouTubeScheduler } = await import('./scheduled-youtube-fetch');
      startYouTubeScheduler(storage);
    } catch (error) {
      console.error('❌ Failed to initialize YouTube scheduler:', error);
      console.warn('⚠️  Continuing without YouTube scheduler...');
    }

    // Sentry Error Handler must be before any other error middleware and after all controllers
    if (sentryEnabled) {
      try {
        setupExpressErrorHandler(app);
      } catch (error) {
        console.warn('⚠️ Sentry error handler not available:', error);
      }
    }

    // Error handling middleware
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      console.error('Global error handler:', err);
      res.status(status).json({ message });
    });

    // Setup Vite or static serving
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    // Start server
    const PORT = parseInt(process.env.PORT || "5001", 10);
    server.listen(PORT, "0.0.0.0", () => {
      log(`Server running on port ${PORT}`);
    });

    // Graceful shutdown
    const shutdown = async () => {
      log('received shutdown signal, closing server');

      // Close Redis connection
      const { closeRedisConnection } = await import('./config/redis-config');
      await closeRedisConnection();

      server.close(() => {
        log('server closed');
        process.exit(0);
      });
      // Force exit if not closed in time
      setTimeout(() => process.exit(1), 10000).unref();
    };
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
})();
