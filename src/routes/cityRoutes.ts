import { Router } from 'express';
import { getCities } from '../controllers/cityController';

const router = Router();

// Endpoint que recibe el parámetro "province" en la query string
router.get('/list', getCities);

export default router;
