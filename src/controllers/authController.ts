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
            res.status(404).json({ error: 'Usuario no encontrado' });
            return;
        }

        // Verificar contraseña según el tipo de usuario
        const storedPassword = isAdmin ? user.password_Admin : user.password_User;
        const isValidPassword = await comparePassword(password, storedPassword);

        if (!isValidPassword) {
            res.status(401).json({ error: 'Credenciales inválidas' });
            return;
        }

        // Generar JWT con los campos correctos
        const token = generateToken({
            id: isAdmin ? user.id_admin : user.id_user,
            email: isAdmin ? user.email : user.email_User,
        });

        // Devolver respuesta con los datos del usuario
        res.json({
            token,
            user: {
                id: isAdmin ? user.id_admin : user.id_user,
                name: isAdmin ? user.name_Admin : user.name_User,
                email: isAdmin ? user.email : user.email_User,
                registration_date: user.registration_date,
            }
        });
    } catch (error) {
        console.error('Error en loginWithEmail:', error);
        res.status(500).json({ error: 'Error del servidor' });
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
