/// <reference types="jest" />

import request from 'supertest'
import express, { Express } from 'express'
import cookieParser from 'cookie-parser'
import { registerRoutes } from '../../server/routes'

// Mock storage interface for testing to avoid import.meta errors in some routes
jest.mock('../../server/routes/admin-media', () => {
    const express = require('express')
    return {
        __esModule: true,
        default: express.Router()
    }
})

// Mock storage interface
const mockStorage = {
    getVariants: jest.fn().mockResolvedValue([]),
    createVariant: jest.fn(),
    updateVariant: jest.fn(),
    deleteVariant: jest.fn(),
    getPopularComparisons: jest.fn().mockResolvedValue([]),
    savePopularComparisons: jest.fn(),
}

describe('Security Audit Integration Tests', () => {
    let app: Express

    beforeAll(async () => {
        app = express()
        app.use(express.json())
        app.use(cookieParser())

        // Register routes
        registerRoutes(app, mockStorage as any)
    })

    describe('Unprotected vs Protected Routes', () => {
        // Test variants - should now be protected
        it('POST /api/variants should return 401 without token', async () => {
            await request(app)
                .post('/api/variants')
                .send({ name: 'New Variant' })
                .expect(401)
        })

        it('PATCH /api/variants/:id should return 401 without token', async () => {
            await request(app)
                .patch('/api/variants/123')
                .send({ price: 1000 })
                .expect(401)
        })

        it('DELETE /api/variants/:id should return 401 without token', async () => {
            await request(app)
                .delete('/api/variants/123')
                .expect(401)
        })

        // Test popular comparisons - should now be protected
        it('POST /api/popular-comparisons should return 401 without token', async () => {
            await request(app)
                .post('/api/popular-comparisons')
                .send([])
                .expect(401)
        })

        // Public routes should still be accessible
        it('GET /api/variants should be accessible without token', async () => {
            await request(app)
                .get('/api/variants')
                .expect(200)
        })

        it('GET /api/popular-comparisons should be accessible without token', async () => {
            await request(app)
                .get('/api/popular-comparisons')
                .expect(200)
        })
    })
})
