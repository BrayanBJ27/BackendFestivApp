import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || 'supersecretkey';

// Hash de la contraseña antes de almacenarla en MySQL
export const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

// Comparar contraseña con SHA2
export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    const hashedInput = crypto.createHash('sha256').update(password).digest('hex');
    return hashedInput === hashedPassword;
};

// Generar token JWT
export const generateToken = (user: { id: number; email: string }): string => {
    return jwt.sign(user, SECRET_KEY, { expiresIn: '1h' });
};
