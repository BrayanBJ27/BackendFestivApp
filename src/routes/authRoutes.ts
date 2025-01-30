import { Router } from 'express';
import { loginWithEmail, loginWithFirebase } from '../controllers/authController';

const router = Router();

router.post('/login', loginWithEmail);
router.post('/login/firebase', loginWithFirebase);

export default router;
