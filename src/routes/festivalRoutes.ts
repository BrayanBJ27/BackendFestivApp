import { Router } from 'express';
import { getAllFestivals, createNewFestival } from '../controllers/festivalController';
import { verifyFirebaseToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/', verifyFirebaseToken, getAllFestivals);
router.post('/', verifyFirebaseToken, createNewFestival);

export default router;
