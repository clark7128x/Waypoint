import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import tripsRouter from './trips';

// Mock Prisma Client
vi.mock('../generated/prisma/client', () => {
  return {
    PrismaClient: class {
      constructor(options?: any) {}
      trip = {
        create: vi.fn().mockResolvedValue({ id: 'trip-123' }),
        findUnique: vi.fn().mockResolvedValue({
          id: 'trip-123',
          total_budget: 1000,
          items: []
        }),
        update: vi.fn().mockResolvedValue({ id: 'trip-123', total_budget: 1500 })
      };
    }
  };
});

const app = express();
app.use(express.json());
app.use('/api/trips', tripsRouter);

describe('Trips API', () => {
  it('POST /api/trips should create a trip', async () => {
    const res = await request(app)
      .post('/api/trips')
      .send({ prompt: 'A week in Ukraine, budget $1000' });
      
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('trip_id', 'trip-123');
    expect(res.body).toHaveProperty('status', 'processing');
  });

  it('GET /api/trips/:id should return trip details', async () => {
    const res = await request(app).get('/api/trips/trip-123');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('trip');
    expect(res.body.trip).toHaveProperty('id', 'trip-123');
  });

  it('PATCH /api/trips/:id/budget should update budget and return swapped items', async () => {
    const res = await request(app)
      .patch('/api/trips/trip-123/budget')
      .send({ new_budget: 1500 });
      
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('swapped_items');
    expect(res.body).toHaveProperty('removed_items');
  });
});
