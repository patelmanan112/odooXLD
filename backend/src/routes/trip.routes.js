import { Router } from 'express';
import {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  createTripStop,
  getTripStops,
  getSingleTripStop,
  updateTripStop,
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

/* Trip Stops Management */
router.post('/:id/stops', createTripStop);
router.get('/:id/stops', getTripStops);
router.put('/:id/stops/reorder', reorderTripStops);
router.patch('/:id/stops/reorder', reorderTripStops);
router.get('/:id/stops/:stopId', getSingleTripStop);
router.put('/:id/stops/:stopId', updateTripStop);
router.delete('/:id/stops/:stopId', deleteTripStop);

/* Budget Calculation */
router.get('/:id/budget', getTripBudget);

/* Trip Activities */
router.post('/stops/:stopId/activities', assignActivityToStop);
router.delete('/stops/:stopId/activities/:activityId', removeActivityFromStop);

export default router;
