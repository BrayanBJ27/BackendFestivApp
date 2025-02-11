import poolPromise from '../config/db';
import { User } from '../types/user';

export const registerUserInDB = async (
    name: string,
    email: string,
    password: string,
    image: string | null = null
): Promise<number> => {
    try {
        const pool = await poolPromise;
        const [result]: any = await pool.query(
            `INSERT INTO Users (name_User, email_User, password_User, image) 
             VALUES (?, ?, ?, ?)`,
            [name, email, password, image]
        );

        console.log("✅ Usuario registrado con ID:", result.insertId);
        return result.insertId;
    } catch (error) {
        console.error("❌ Error en registerUser:", error);
        throw error;
    }
};

export const checkUserExists = async (email: string): Promise<boolean> => {
    try {
        const pool = await poolPromise;
        const [rows]: any = await pool.query(
            'SELECT id_user FROM Users WHERE email_User = ?',
            [email]
        );
        return rows.length > 0;
    } catch (error) {
        console.error("❌ Error checking user existence:", error);
        throw error;
    }
};