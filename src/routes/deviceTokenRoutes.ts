import { Router } from 'express';
import { registerDeviceToken } from '../controllers/deviceTokenController';

const router = Router();

// Ruta para registrar el device token
router.post('/register', registerDeviceToken);

export default router;
