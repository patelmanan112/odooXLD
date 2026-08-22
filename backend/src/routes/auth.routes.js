import { Router } from 'express';
import { signup, login, checkEmail, getMe, updateMe } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/check-email', checkEmail);
router.get('/me', authMiddleware, getMe);
router.put('/me', authMiddleware, updateMe);
router.post('/signup', signup);
router.post('/login', login);

export default router;
