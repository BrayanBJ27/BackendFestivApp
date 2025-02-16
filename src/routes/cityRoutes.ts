import { Router } from 'express';
import { getCities, getLocationId } from '../controllers/cityController';

const router = Router();

// Endpoint que recibe el parámetro "province" en la query string
router.get('/list', getCities);
router.get('/location', getLocationId);

export default router;
