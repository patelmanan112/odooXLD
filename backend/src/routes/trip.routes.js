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
  createTripActivity,
  getTripStopActivities,
  getSingleTripActivity,
  updateTripActivity,
  deleteTripActivity,
  reorderTripActivities,
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

/* Trip Activities Scheduling */
router.post('/:id/stops/:stopId/activities', createTripActivity);
router.get('/:id/stops/:stopId/activities', getTripStopActivities);
router.put('/:id/stops/:stopId/activities/reorder', reorderTripActivities);
router.patch('/:id/stops/:stopId/activities/reorder', reorderTripActivities);
router.get('/:id/stops/:stopId/activities/:tripActivityId', getSingleTripActivity);
router.put('/:id/stops/:stopId/activities/:tripActivityId', updateTripActivity);
router.delete('/:id/stops/:stopId/activities/:tripActivityId', deleteTripActivity);

/* Direct Stop Activities Routes */
router.post('/stops/:stopId/activities', createTripActivity);
router.delete('/stops/:stopId/activities/:activityId', deleteTripActivity);

/* Budget Calculation */
router.get('/:id/budget', getTripBudget);

export default router;
