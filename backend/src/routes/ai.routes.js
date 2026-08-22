import { Router } from 'express';
import { getLocationPhoto } from '../controllers/ai.controller.js';

const router = Router();

router.post('/location-photo', getLocationPhoto);

export default router;
