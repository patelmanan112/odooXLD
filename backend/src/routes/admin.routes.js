import { Router } from 'express';
import {
  getDashboardStats,
  getAdminUsers,
  getAdminUserById,
  updateUserRole,
  getAdminTrips,
  deleteAdminTrip,
  createAdminCity,
  updateAdminCity,
  deleteAdminCity,
  createAdminActivity,
  updateAdminActivity,
  deleteAdminActivity
} from '../controllers/admin.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { adminMiddleware } from '../middleware/admin.middleware.js';

const router = Router();

// Enforce authentication & ADMIN role middleware on all admin routes
router.use(authMiddleware);
router.use(adminMiddleware);

/* Dashboard Stats */
router.get('/dashboard', getDashboardStats);

/* User Management */
router.get('/users', getAdminUsers);
router.get('/users/:userId', getAdminUserById);
router.put('/users/:userId/role', updateUserRole);

/* Trip Management */
router.get('/trips', getAdminTrips);
router.delete('/trips/:tripId', deleteAdminTrip);

/* City Management */
router.post('/cities', createAdminCity);
router.put('/cities/:cityId', updateAdminCity);
router.delete('/cities/:cityId', deleteAdminCity);

/* Activity Management */
router.post('/activities', createAdminActivity);
router.put('/activities/:activityId', updateAdminActivity);
router.delete('/activities/:activityId', deleteAdminActivity);

export default router;
