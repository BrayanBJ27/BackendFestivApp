import { Router } from 'express';
import { loginWithEmail, loginWithFirebase } from '../controllers/authController';

const router = Router();

router.post('/login', async (req, res) => {
    await loginWithEmail(req, res);
});

router.post('/login/firebase', async (req, res) => {
    await loginWithFirebase(req, res);
});

export default router;
