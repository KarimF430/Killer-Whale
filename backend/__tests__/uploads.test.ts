import request from 'supertest';
import express from 'express';
import { handleUploads } from '../server/uploads-handler';

// Test the actual exported handler to ensure production code is verified
const app = express();
app.get('/uploads/*', handleUploads);

describe('Path Traversal Security Test (via handleUploads)', () => {
  it('should allow valid upload paths (not returning 403)', async () => {
    const response = await request(app).get('/uploads/test.jpg');
    expect(response.status).not.toBe(403);
  });

  it('should block encoded traversal sequences with 403', async () => {
    // Encoded sequences are the primary way to bypass standard middleware normalization
    const response = await request(app).get('/uploads/%2e%2e%2fpackage.json');
    expect(response.status).toBe(403);
    expect(response.body.error).toBe('Access denied');
  });

  it('should block multiple encoded traversal sequences', async () => {
    const response = await request(app).get('/uploads/%2e%2e%2f%2e%2e%2fpackage.json');
    expect(response.status).toBe(403);
    expect(response.body.error).toBe('Access denied');
  });

  it('should block traversal even if it points to a valid file outside uploads', async () => {
    const response = await request(app).get('/uploads/%2e%2e%2fpackage.json');
    expect(response.status).toBe(403);
  });
});
