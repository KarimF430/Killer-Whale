import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
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
import { warmUpCache } from "./middleware/redis-cache";
import compression from "compression";
import pinoHttp from "pino-http";

// Load environment variables
dotenv.config();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
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
app.use('/api', apiLimiter);

// Serve uploaded files statically
const uploadsStaticPath = path.join(__dirname, '../uploads');
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

// SECURE CORS configuration - whitelist specific origins
const allowedOrigins = [
  'https://motoroctane.com',
  'https://www.motoroctane.com',
  'http://localhost:3000',
  'http://localhost:5001',
  'http://192.168.1.23:3000', // Mobile testing
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
      } catch {}
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

(async () => {
  // Initialize MongoDB storage
  const storageImpl = new MongoDBStorage();
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/motoroctane';
  
  try {
    await storageImpl.connect(mongoUri);
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB. Please check:');
    console.error('   1. MongoDB is running (brew services start mongodb-community)');
    console.error('   2. MONGODB_URI in .env file is correct');
    console.error('   3. Network connection is available');
    process.exit(1);
  }
  
  // Initialize news storage
  await newsStorage.initialize();
  // Warm up Redis cache for hot endpoints
  try {
    await warmUpCache(storageImpl);
  } catch (e) {
    console.warn('Cache warmup skipped:', e instanceof Error ? e.message : e);
  }
  
  // Initialize backup service
  const backupService = createBackupService(storageImpl as unknown as IStorage);
  
  // Start automatic backups every 30 minutes
  backupService.startAutoBackup(30);
  
  // Register monitoring routes (no auth required)
  app.use('/api/monitoring', monitoringRoutes);
  
  // Register API routes FIRST before Vite
  registerRoutes(app, storageImpl as unknown as IStorage, backupService);
  
  const server = createServer(app);

  // Error handler for API routes
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    console.error(err);
  });

  // Setup Vite AFTER all API routes are registered
  // This ensures API routes take precedence over Vite's catch-all
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5001 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5001', 10);
  server.listen(port, "0.0.0.0", () => {
    log(`serving on port ${port}`);
  });

  // Graceful shutdown
  const shutdown = () => {
    log('received shutdown signal, closing server');
    server.close(() => {
      log('server closed');
      process.exit(0);
    });
    // Force exit if not closed in time
    setTimeout(() => process.exit(1), 10000).unref();
  };
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
})();
