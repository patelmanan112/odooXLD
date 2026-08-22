import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/user.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/me', getProfile);
router.put('/me', updateProfile);

export default router;
