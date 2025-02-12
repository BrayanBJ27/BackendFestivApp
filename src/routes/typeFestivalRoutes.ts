import { Router } from 'express';
import { getAllFestival, createNewTypeFestival } from '../controllers/typeFestivalController';

const router = Router();

router.get('/list', getAllFestival);
router.post('/register',createNewTypeFestival);

export default router;
