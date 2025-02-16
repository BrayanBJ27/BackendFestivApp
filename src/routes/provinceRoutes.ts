import { Router } from 'express';
import { getAllProvince } from '../controllers/provinceController';

const router = Router();

router.get('/list', getAllProvince);

export default router;
