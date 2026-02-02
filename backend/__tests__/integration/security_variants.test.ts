/// <reference types="jest" />

import request from 'supertest'
import express, { Express } from 'express'
import cookieParser from 'cookie-parser'
import { registerRoutes } from '../../server/routes'

// Mock admin-media to avoid import.meta.url errors
jest.mock('../../server/routes/admin-media', () => {
    return {
        __esModule: true,
        default: {
            stack: [],
            params: {},
            path: '',
            get: () => { },
            post: () => { },
            put: () => { },
            patch: () => { },
            delete: () => { },
            use: () => { }
        }
    }
})

// Mock storage interface
const mockStorage = {
    createVariant: jest.fn().mockResolvedValue({ id: 'v1', name: 'New Variant' }),
    updateVariant: jest.fn().mockResolvedValue({ id: 'v1', name: 'Updated Variant' }),
    deleteVariant: jest.fn().mockResolvedValue(true),
    savePopularComparisons: jest.fn().mockResolvedValue([{ id: 'c1' }]),
    getVariant: jest.fn().mockResolvedValue({ id: 'v1', name: 'Existing Variant', modelId: 'm1', price: 1000000 }),
    getModel: jest.fn().mockResolvedValue({ id: 'm1', brandId: 'b1', name: 'Model 1' }),
    getBrand: jest.fn().mockResolvedValue({ id: 'b1', name: 'Brand 1' }),
}

describe('Security: Missing Authentication on Variants and Comparisons', () => {
    let app: Express

    beforeAll(() => {
        app = express()
        app.use(express.json())
        app.use(cookieParser())
        registerRoutes(app, mockStorage as any)
    })

    describe('POST /api/variants', () => {
        it('should return 401 when no token is provided (EXPECTED FAILURE - currently unprotected)', async () => {
            const response = await request(app)
                .post('/api/variants')
                .send({
                    brandId: 'b1',
                    modelId: 'm1',
                    name: 'Unprotected Variant',
                    price: 500000
                })

            // This test is expected to fail (receive 201 instead of 401) before the fix
            expect(response.status).toBe(401)
        })
    })

    describe('PATCH /api/variants/:id', () => {
        it('should return 401 when no token is provided (EXPECTED FAILURE - currently unprotected)', async () => {
            const response = await request(app)
                .patch('/api/variants/v1')
                .send({ price: 600000 })

            expect(response.status).toBe(401)
        })
    })

    describe('DELETE /api/variants/:id', () => {
        it('should return 401 when no token is provided (EXPECTED FAILURE - currently unprotected)', async () => {
            const response = await request(app)
                .delete('/api/variants/v1')

            expect(response.status).toBe(401)
        })
    })

    describe('POST /api/popular-comparisons', () => {
        it('should return 401 when no token is provided (EXPECTED FAILURE - currently unprotected)', async () => {
            const response = await request(app)
                .post('/api/popular-comparisons')
                .send([{ model1Id: 'm1', model2Id: 'm2' }])

            expect(response.status).toBe(401)
        })
    })
})
