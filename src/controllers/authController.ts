import { Request, Response } from 'express';
import { findUserByEmail, registerUser } from '../models/authModel';
import { hashPassword, comparePassword, generateToken } from '../config/auth';
import admin from '../config/firebase';

// 🔹 Iniciar sesión con email y contraseña (MySQL + JWT)
export const loginWithEmail = async (req: Request, res: Response): Promise<void> => {
    const { email, password, isAdmin } = req.body;

    try {
        const user = await findUserByEmail(email, isAdmin);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        // Verificar contraseña
        const isValidPassword = await comparePassword(
            password,
            user.password_Admin || user.password_User || ''
        );

        if (!isValidPassword) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        // Generar JWT
        const token = generateToken({
            id: user.id_admin || user.id_user,
            email: user.email_Admin || user.email_User || '',
        });

        res.json({ token, user });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// 🔹 Iniciar sesión con Google o Facebook (Firebase + MySQL + JWT)
export const loginWithFirebase = async (req: Request, res: Response): Promise<void> => {
    const { idToken } = req.body;

    try {
        // Verificar token de Firebase
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { uid, email, name, picture } = decodedToken;

        if (!email) {
            res.status(400).json({ error: 'Email is required' });
            return;
        }

        // Buscar usuario en MySQL
        let user = await findUserByEmail(email, false);

        if (!user) {
            // Registrar nuevo usuario en MySQL si no existe
            const hashedPassword = await hashPassword(uid);
            const userId = await registerUser(name || 'Unnamed User', email, hashedPassword, picture || null);
            user = { id_user: userId, name_User: name, email_User: email, image: picture };
        }

        // Generar JWT
        const token = generateToken({
            id: user.id_user,
            email: user.email_User || '',
        });

        res.json({ token, user });
    } catch (error) {
        res.status(401).json({ error: 'Invalid Firebase Token' });
    }
};
