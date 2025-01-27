import { Router } from 'express';
import { getAllFestivals, createNewFestival } from '../controllers/festivalController';

const router = Router();

router.get('/', getAllFestivals);
router.post('/', createNewFestival);

export default router;
