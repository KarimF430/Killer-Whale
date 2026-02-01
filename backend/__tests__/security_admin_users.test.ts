import request from 'supertest';
import express from 'express';
import session from 'express-session';
import adminUsersRoutes from '../server/routes/admin-users';
import { authenticateToken, authorizeRole } from '../server/auth';

// We need to mock the User model
jest.mock('../server/db/schemas', () => ({
  User: {
    find: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    lean: jest.fn().mockResolvedValue([
      { id: '1', email: 'victim@example.com', firstName: 'Victim', lastName: 'User' }
    ]),
    countDocuments: jest.fn().mockResolvedValue(10)
  }
}));

describe('Security: Admin Users Exposure', () => {
  let app: express.Express;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use(session({
      secret: 'test',
      resave: false,
      saveUninitialized: false
    }));
    // Apply the same protection as in index.ts
    app.use('/api/admin/users', authenticateToken, authorizeRole('admin', 'super_admin'), adminUsersRoutes);
  });

  it('should not allow unauthorized access to /api/admin/users/export', async () => {
    const response = await request(app).get('/api/admin/users/export');

    // If it's vulnerable, it will return 200 and the CSV
    // If it's secured, it should return 401
    expect(response.status).toBe(401);
  });
});
