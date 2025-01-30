// authModel.ts
import pool from '../config/db';

export const findUserByEmail = async (email: string, isAdmin: boolean): Promise<any> => {
    try {
        let query, params;
        
        if (isAdmin) {
            query = `SELECT id_admin, name_Admin, email, password_Admin, registration_date 
         FROM Admins WHERE email = ?`;
        } else {
            query = `SELECT id_user, name_User, email_User, password_User, registration_date 
         FROM Users WHERE email_User = ?`;
        }
        
        const [rows]: any = await pool.query(query, [email]);

        // Debug: Imprimir resultados en consola
        console.log('Query:', query);
        console.log('Email buscado:', email);
        console.log('Resultados encontrados:', rows);

        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.error('Error en findUserByEmail:', error);
        throw error;
    }
};

// Mantener el método registerUser como está
export const registerUser = async (
    name: string, 
    email: string, 
    password: string, 
    image: string | null = null
): Promise<number> => {
    const [result]: any = await pool.query(
        `INSERT INTO Users (name_User, email_User, password_User, image) 
         VALUES (?, ?, ?, ?)`,
        [name, email, password, image]
    );
    return result.insertId;
};