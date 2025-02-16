import { Router } from 'express';
import { getAllFestivals, createNewFestival } from '../controllers/festivityController';

const router = Router();

router.get('/list', getAllFestivals);
router.post('/register', createNewFestival);

export default router;
