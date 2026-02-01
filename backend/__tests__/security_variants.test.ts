import request from 'supertest';
import express from 'express';
import { MongoDBStorage } from '../server/db/mongodb-storage';
import cookieParser from "cookie-parser";

// Mock problematic modules that use import.meta.url
jest.mock('../server/routes/admin-media', () => ({
  __esModule: true,
  default: express.Router()
}));

// Now import registerRoutes
import { registerRoutes } from '../server/routes';

// Mock MongoDBStorage
jest.mock('../server/db/mongodb-storage');

describe('Security: Unauthorized Access to Variants', () => {
  let app: express.Express;
  let mockStorage: any;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use(cookieParser());
    mockStorage = new MongoDBStorage();
    registerRoutes(app, mockStorage);
  });

  it('should not allow unauthorized POST to /api/variants', async () => {
    const response = await request(app)
      .post('/api/variants')
      .send({
        brandId: 'brand123',
        modelId: 'model123',
        name: 'Hacked Variant',
        price: 999999
      });

    // If it's vulnerable, it will try to create the variant and likely return 400 or 201 (depending on mock)
    // If it's secured, it should return 401
    expect(response.status).toBe(401);
  });

  it('should not allow unauthorized PATCH to /api/variants/:id', async () => {
    const response = await request(app)
      .patch('/api/variants/variant123')
      .send({
        price: 1
      });

    expect(response.status).toBe(401);
  });

  it('should not allow unauthorized DELETE to /api/variants/:id', async () => {
    const response = await request(app)
      .delete('/api/variants/variant123');

    expect(response.status).toBe(401);
  });
});
