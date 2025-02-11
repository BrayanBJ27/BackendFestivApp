import { Request, Response } from 'express';
import { registerUserInDB, checkUserExists } from '../models/userModel';
import { hashPassword } from '../config/auth';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password } = req.body;

        // Validaciones básicas
        if (!name || !email || !password) {
            res.status(400).json({ error: 'All fields are required' });
            return;
        }

        // Verificar si el usuario ya existe
        const userExists = await checkUserExists(email);
        if (userExists) {
            res.status(400).json({ error: 'Email already registered' });
            return;
        }

        // Hash de la contraseña
        const hashedPassword = await hashPassword(password);

        // Registrar usuario
        const userId = await registerUserInDB(name, email, hashedPassword);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            userId
        });
    } catch (error) {
        console.error('Error in user registration:', error);
        res.status(500).json({ error: 'Server error during registration' });
    }
};