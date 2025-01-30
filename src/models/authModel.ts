import pool from '../config/db';

// Buscar usuario en MySQL por email
export const findUserByEmail = async (email: string, isAdmin: boolean): Promise<any> => {
    const table = isAdmin ? 'Admins' : 'Users';
    const [rows]: any = await pool.query(`SELECT * FROM ${table} WHERE email = ?`, [email]);
    return rows.length ? rows[0] : null;
};

// Registrar nuevo usuario en MySQL
export const registerUser = async (name: string, email: string, password: string, image: string | null = null): Promise<number> => {
    const [result]: any = await pool.query(
        `INSERT INTO Users (name_User, email_User, password_User, image) VALUES (?, ?, ?, ?)`,
        [name, email, password, image]
    );
    return result.insertId;
};
