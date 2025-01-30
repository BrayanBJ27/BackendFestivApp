import { Request, Response } from 'express';
import { findUserByEmail, registerUser } from '../models/authModel';
import { hashPassword, comparePassword, generateToken } from '../config/auth';
import admin from '../config/firebase';

export const loginWithEmail = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
        // Primero intentamos buscar un admin
        let user = await findUserByEmail(email, true); // true para buscar en tabla de admins
        let isAdmin = true;

        // Si no es admin, buscamos en usuarios normales
        if (!user) {
            user = await findUserByEmail(email, false);
            isAdmin = false;
        }

        if (!user) {
            res.status(401).json({ error: 'Email no registrado' });
            return;
        }
        const storedPassword = isAdmin ? user.password_Admin : user.password_User;
        console.log("🔹 Password almacenado en DB:", storedPassword);
        console.log("🔹 Password ingresado:", password);

        const isValidPassword = await comparePassword(
            password, 
            isAdmin ? user.password_Admin : user.password_User
        );

        if (!isValidPassword) {
            res.status(401).json({ error: 'Contraseña incorrecta' });
            return;
        }

        const token = generateToken({ 
            id: isAdmin ? user.id_admin : user.id_user, 
            email: isAdmin ? user.email_Admin : user.email_User,
            isAdmin 
        });

        res.json({ 
            success: true,
            token, 
            user: {
                id: isAdmin ? user.id_admin : user.id_user,
                name: isAdmin ? user.name_Admin : user.name_User,
                email: isAdmin ? user.email_Admin : user.email_User,
                isAdmin
            }
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

export const loginWithFirebase = async (req: Request, res: Response): Promise<void> => {
    const { idToken } = req.body;

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { email, name, picture } = decodedToken;

        if (!email) {
            res.status(400).json({ error: 'Email is required' });
            return;
        }

        let user = await findUserByEmail(email, false);
        if (!user) {
            const hashedPassword = await hashPassword(email);
            const userId = await registerUser(name || 'Unnamed User', email, hashedPassword, picture || null);
            user = { id_user: userId, name_User: name, email_User: email, image: picture };
        }

        const token = generateToken({ 
            id: user.id_user, 
            email: user.email_User || '',
            isAdmin: false // Los usuarios de Firebase siempre son usuarios normales
        });
        
        res.json({ token, user });
    } catch (error) {
        res.status(401).json({ error: 'Invalid Firebase Token' });
    }
};