import express from 'express';
import { getUserProfile, registerUser, updateUserProfile } from '../controllers/userController';

const router = express.Router();

router.get('/:id', getUserProfile);
router.post('/register', registerUser);
router.put('/update/:id', updateUserProfile);

export default router;