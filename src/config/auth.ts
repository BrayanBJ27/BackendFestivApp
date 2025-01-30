import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || 'supersecretkey';

export const hashPassword = async (password: string): Promise<string> => {
    // Usar SHA2-256 para mantener consistencia con la base de datos
    return crypto.createHash('sha256').update(password).digest('hex');
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    // Generar el hash SHA2-256 de la contraseña ingresada
    const inputHash = crypto.createHash('sha256').update(password).digest('hex');

    // 🔹 Debug: Imprimir los valores para comparar
    console.log("🔹 Contraseña ingresada:", password);
    console.log("🔹 Hash generado:", inputHash);
    console.log("🔹 Hash en base de datos:", hashedPassword);

    // Comparar con el hash almacenado en la BD
    return inputHash === hashedPassword;
};

export const generateToken = (user: { id: number; email: string; isAdmin?: boolean }): string => {
    return jwt.sign(user, SECRET_KEY, { expiresIn: '1h' });
};