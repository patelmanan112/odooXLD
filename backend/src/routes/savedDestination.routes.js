import { Router } from 'express';
import {
  saveDestination,
  getSavedDestinations,
  checkCityIsSaved,
  getSingleSavedDestination,
  deleteSavedDestination
} from '../controllers/savedDestination.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.post('/', saveDestination);
router.get('/', getSavedDestinations);
router.get('/check/:cityId', checkCityIsSaved);
router.get('/:id', getSingleSavedDestination);
router.delete('/:id', deleteSavedDestination);

export default router;
