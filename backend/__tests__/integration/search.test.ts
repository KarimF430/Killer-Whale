
import request from 'supertest'
import express, { Express } from 'express'
import { registerRoutes } from '../../server/routes'
import { connectTestDB, disconnectTestDB } from '../helpers/test-db'

// Mock storage interface
const mockStorage = {
    async getBrands() { return [] },
    async getModels() { return [] },
    async getVariants() { return [] },
    async getAdminUser() { return null },
}

// Mock search index service to force fallback to MongoDB
jest.mock('../../server/services/search-index', () => ({
    buildSearchIndex: jest.fn().mockResolvedValue({}),
    searchFromIndex: jest.fn().mockResolvedValue(null),
    invalidateSearchIndex: jest.fn().mockResolvedValue({}),
    getSearchIndexStats: jest.fn().mockReturnValue({})
}))

// Mock admin-media route to avoid dependencies
jest.mock('../../server/routes/admin-media', () => {
    const express = require('express')
    return {
        __esModule: true,
        default: express.Router()
    }
})

describe('Search API Security', () => {
    let app: Express

    beforeAll(async () => {
        await connectTestDB()
        app = express()
        app.use(express.json())
        registerRoutes(app, mockStorage as any)
    })

    afterAll(async () => {
        await disconnectTestDB()
    })

    it('should handle search queries with regex special characters safely', async () => {
        // This query contains many regex special characters that could cause issues if not escaped
        const dangerousQuery = '.*+?^${}()|[\\]\\'

        const response = await request(app)
            .get(`/api/search?q=${encodeURIComponent(dangerousQuery)}`)
            .expect(200)

        expect(response.body.results).toBeInstanceOf(Array)
    })

    it('should handle unterminated character class safely', async () => {
        const unterminatedQuery = '['

        const response = await request(app)
            .get(`/api/search?q=${encodeURIComponent(unterminatedQuery)}`)
            .expect(200)

        expect(response.body.results).toBeInstanceOf(Array)
    })

    it('should still work for normal search queries', async () => {
        const normalQuery = 'tata nexon'

        const response = await request(app)
            .get(`/api/search?q=${encodeURIComponent(normalQuery)}`)
            .expect(200)

        expect(response.body.results).toBeInstanceOf(Array)
    })
})
