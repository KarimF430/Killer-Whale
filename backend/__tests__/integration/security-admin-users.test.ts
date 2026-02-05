/// <reference types="jest" />
import request from 'supertest';
import express, { Express } from 'express';
import cookieParser from 'cookie-parser';
import { authenticateToken, authorizeRole } from '../../server/auth';
import adminUsersRouter from '../../server/routes/admin-users';

describe('Security Audit - Admin Users Routes', () => {
    let app: Express;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.use(cookieParser());
        // Mount with protection as we did in index.ts
        app.use('/api/admin/users', authenticateToken, authorizeRole('admin', 'super_admin'), adminUsersRouter);
    });

    const routes = [
        { method: 'get', path: '/api/admin/users/export' },
        { method: 'get', path: '/api/admin/users/stats' },
        { method: 'get', path: '/api/admin/users/recent' },
    ];

    routes.forEach(({ method, path }) => {
        it(`${method.toUpperCase()} ${path} should return 401 without token`, async () => {
            const response = await (request(app) as any)[method](path);
            expect(response.status).toBe(401);
        });
    });
});
