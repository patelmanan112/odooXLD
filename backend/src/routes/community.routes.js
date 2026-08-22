import { Router } from 'express';
import { getPublicTrips, getPublicTripById } from '../controllers/community.controller.js';

const router = Router();

router.get('/trips', getPublicTrips);
router.get('/trips/:tripId', getPublicTripById);

export default router;
