/// <reference types="jest" />
import request from 'supertest';
import express, { Express } from 'express';
import cookieParser from 'cookie-parser';
import { registerRoutes } from '../../server/routes';

// Mock storage
const mockStorage = {
    getBrands: jest.fn().mockResolvedValue([]),
    getModels: jest.fn().mockResolvedValue([]),
    getVariants: jest.fn().mockResolvedValue([]),
    getPopularComparisons: jest.fn().mockResolvedValue([]),
};

// Mock other modules that might be imported in routes.ts
jest.mock('../../server/routes/admin-media', () => {
    const express = require('express');
    return {
        __esModule: true,
        default: express.Router()
    };
});

describe('Security Audit - Protected Routes', () => {
    let app: Express;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.use(cookieParser());
        registerRoutes(app, mockStorage as any);
    });

    const protectedRoutes = [
        { method: 'post', path: '/api/variants' },
        { method: 'patch', path: '/api/variants/123' },
        { method: 'delete', path: '/api/variants/123' },
        { method: 'post', path: '/api/popular-comparisons' },
        { method: 'get', path: '/api/search/stats' },
    ];

    protectedRoutes.forEach(({ method, path }) => {
        it(`${method.toUpperCase()} ${path} should return 401 without token`, async () => {
            const response = await (request(app) as any)[method](path);
            expect(response.status).toBe(401);
            expect(response.body.error).toBe('Access denied. No token provided.');
        });
    });
});
