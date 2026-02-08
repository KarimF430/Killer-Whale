/// <reference types="jest" />

import request from 'supertest'
import express, { Express } from 'express'
import cookieParser from 'cookie-parser'
import { registerRoutes } from '../../server/routes'

jest.mock('../../server/routes/admin-media', () => ({
    __esModule: true,
    default: require('express').Router()
}))

const mockStorage = {
    getAdminUser: jest.fn(),
    getAdminUserById: jest.fn(),
    getBrands: jest.fn().mockResolvedValue([]),
    getModels: jest.fn().mockResolvedValue([]),
    getVariants: jest.fn().mockResolvedValue([]),
    getPopularComparisons: jest.fn().mockResolvedValue([]),
    getStats: jest.fn().mockResolvedValue({}),
}

describe('Security Hardening: Variants & Comparisons', () => {
    let app: Express

    beforeAll(() => {
        app = express()
        app.use(express.json())
        app.use(cookieParser())
        // Ensure AUTH_BYPASS is disabled
        process.env.AUTH_BYPASS = 'false'
        registerRoutes(app, mockStorage as any)
    })

    test('POST /api/variants should return 401', async () => {
        const response = await request(app).post('/api/variants').send({})
        expect(response.status).toBe(401)
    })

    test('PATCH /api/variants/:id should return 401', async () => {
        const response = await request(app).patch('/api/variants/1').send({})
        expect(response.status).toBe(401)
    })

    test('DELETE /api/variants/:id should return 401', async () => {
        const response = await request(app).delete('/api/variants/1')
        expect(response.status).toBe(401)
    })

    test('POST /api/popular-comparisons should return 401', async () => {
        const response = await request(app).post('/api/popular-comparisons').send({})
        expect(response.status).toBe(401)
    })
})
