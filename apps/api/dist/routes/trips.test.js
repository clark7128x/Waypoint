"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const trips_1 = __importDefault(require("./trips"));
// Mock Prisma Client
vitest_1.vi.mock('../generated/prisma/client', () => {
    return {
        PrismaClient: class {
            constructor() {
                this.trip = {
                    create: vitest_1.vi.fn().mockResolvedValue({ id: 'trip-123' }),
                    findUnique: vitest_1.vi.fn().mockResolvedValue({
                        id: 'trip-123',
                        total_budget: 1000,
                        items: []
                    }),
                    update: vitest_1.vi.fn().mockResolvedValue({ id: 'trip-123', total_budget: 1500 })
                };
            }
        }
    };
});
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/trips', trips_1.default);
(0, vitest_1.describe)('Trips API', () => {
    (0, vitest_1.it)('POST /api/trips should create a trip', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .post('/api/trips')
            .send({ prompt: 'A week in Ukraine, budget $1000' });
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body).toHaveProperty('trip_id', 'trip-123');
        (0, vitest_1.expect)(res.body).toHaveProperty('status', 'processing');
    }));
    (0, vitest_1.it)('GET /api/trips/:id should return trip details', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).get('/api/trips/trip-123');
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body).toHaveProperty('trip');
        (0, vitest_1.expect)(res.body.trip).toHaveProperty('id', 'trip-123');
    }));
    (0, vitest_1.it)('PATCH /api/trips/:id/budget should update budget and return swapped items', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .patch('/api/trips/trip-123/budget')
            .send({ new_budget: 1500 });
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body).toHaveProperty('swapped_items');
        (0, vitest_1.expect)(res.body).toHaveProperty('removed_items');
    }));
});
