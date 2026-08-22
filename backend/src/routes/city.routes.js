import { Router } from 'express';
import { getCities, getCityPlaces } from '../controllers/city.controller.js';

const router = Router();

router.get('/places', getCityPlaces);
router.get('/', getCities);

export default router;
