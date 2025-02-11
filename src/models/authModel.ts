import poolPromise from '../config/db';

export const findUserByEmail = async (email: string, isAdmin: boolean): Promise<any> => {
    try {
        const pool = await poolPromise; // Asegurar que el pool está inicializado
        let query;
        
        if (isAdmin) {
            query = `SELECT id_admin, name_Admin, email, password_Admin, registration_date FROM Admins WHERE email = ?`;
        } else {
            query = `SELECT id_user, name_User, email_User, password_User, registration_date FROM Users WHERE email_User = ?`;
        }

        const [rows]: any = await pool.query(query, [email]);

        console.log("🔹 Query:", query);
        console.log("🔹 Email buscado:", email);
        console.log("🔹 Resultados encontrados:", rows);

        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.error("❌ Error en findUserByEmail:", error);
        throw error;
    }
};

export const registerUser = async (
    name: string, 
    email: string, 
    password: string, 
    image: string | null = null
): Promise<number> => {
    try {
        const pool = await poolPromise; // Esperar la conexión al pool

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
