import { Router } from 'express';
import { updateFestivalRating } from '../controllers/ratingController';

const router = Router();

router.put('/update', updateFestivalRating);

export default router;
