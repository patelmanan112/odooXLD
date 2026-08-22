import { Router } from 'express';
import {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  addTripStop,
  deleteTripStop,
  reorderTripStops,
  assignActivityToStop,
  removeActivityFromStop,
  getTripBudget
} from '../controllers/trip.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.post('/', createTrip);
router.get('/', getTrips);
router.get('/:id', getTripById);
router.put('/:id', updateTrip);
router.delete('/:id', deleteTrip);

/* Stops & Budget */
router.post('/:id/stops', addTripStop);
router.delete('/:id/stops/:stopId', deleteTripStop);
router.patch('/:id/stops/reorder', reorderTripStops);
router.get('/:id/budget', getTripBudget);

/* Trip Activities */
router.post('/stops/:stopId/activities', assignActivityToStop);
router.delete('/stops/:stopId/activities/:activityId', removeActivityFromStop);

export default router;
