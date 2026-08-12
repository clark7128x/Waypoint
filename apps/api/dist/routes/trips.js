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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("../generated/prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Mock POST /api/trips
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { prompt } = req.body;
    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }
    // Phase 0: Mocking trip creation
    // We'll create a real trip in the DB just for Phase 0
    try {
        // Generate some mock items
        const trip = yield prisma.trip.create({
            data: {
                destination: "Mocked Destination",
                start_date: new Date(),
                end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // +7 days
                total_budget: 1000,
                status: "processing",
                user_id: "mock_user_id", // Mocked user until Auth
                items: {
                    create: [
                        { type: "flight", cost: 350, source_citation: "SkyScanner", justification: "Cheapest direct flight found." },
                        { type: "hotel", cost: 400, source_citation: "Booking.com", justification: "Highly rated 4-star hotel in the city center." },
                        { type: "activity", cost: 50, source_citation: "TripAdvisor", justification: "Popular local walking tour." }
                    ]
                }
            }
        });
        return res.json({ trip_id: trip.id, status: "processing" });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}));
// GET /api/trips/:id
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const trip = yield prisma.trip.findUnique({
            where: { id },
            include: { items: true }
        });
        if (!trip) {
            return res.status(404).json({ error: 'Trip not found' });
        }
        return res.json({ trip, items: trip.items });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}));
// PATCH /api/trips/:id/budget
router.patch('/:id/budget', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { new_budget } = req.body;
    if (typeof new_budget !== 'number') {
        return res.status(400).json({ error: 'new_budget is required and must be a number' });
    }
    try {
        // Update trip budget
        yield prisma.trip.update({
            where: { id },
            data: { total_budget: new_budget }
        });
        // Mock swapped/removed items for Phase 0
        return res.json({
            swapped_items: [],
            removed_items: []
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}));
exports.default = router;
