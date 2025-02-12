import { localPool, alwaysDataPool } from '../config/db';
import { ResultSetHeader } from 'mysql2';

export const findUserByEmail = async (email: string, isAdmin: boolean): Promise<any> => {
    try {
        let query;
        
        if (isAdmin) {
            query = `SELECT id_admin, name_Admin, email, password_Admin, registration_date FROM Admins WHERE email = ?`;
        } else {
            query = `SELECT id_user, name_User, email_User, password_User, registration_date FROM Users WHERE email_User = ?`;
        }

        // Intentar buscar en ambas bases de datos
        const [localResult, alwaysDataResult] = await Promise.all([
            localPool.query(query, [email]),
            alwaysDataPool.query(query, [email])
        ]);

        console.log("🔹 Query:", query);
        console.log("🔹 Email buscado:", email);

        // Obtener los resultados de ambas bases de datos
        const localRows = (localResult[0] as any[]);
        const alwaysDataRows = (alwaysDataResult[0] as any[]);

        console.log("🔹 Resultados encontrados en local:", localRows);
        console.log("🔹 Resultados encontrados en AlwaysData:", alwaysDataRows);

        // Retornar el primer resultado encontrado (prioridad a la base de datos local)
        return localRows.length > 0 ? localRows[0] : 
               alwaysDataRows.length > 0 ? alwaysDataRows[0] : null;
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
    let localUserId: number | null = null;
    let alwaysDataUserId: number | null = null;

    try {
        // Ejecutar registros en paralelo
        const [localResult, alwaysDataResult] = await Promise.allSettled([
            // Registro en base de datos local
            localPool.query<ResultSetHeader>(
                `INSERT INTO Users (name_User, email_User, password_User, image) 
                 VALUES (?, ?, ?, ?)`,
                [name, email, password, image]
            ),
            // Registro en AlwaysData
            alwaysDataPool.query<ResultSetHeader>(
                `INSERT INTO Users (name_User, email_User, password_User, image) 
                 VALUES (?, ?, ?, ?)`,
                [name, email, password, image]
            )
        ]);

        // Procesar resultados
        if (localResult.status === 'fulfilled') {
            const [result] = localResult.value;
            localUserId = result.insertId;
            console.log("✅ Usuario registrado en DB local con ID:", localUserId);
        } else {
            console.error("❌ Error en registro local:", localResult.reason);
        }

        if (alwaysDataResult.status === 'fulfilled') {
            const [result] = alwaysDataResult.value;
            alwaysDataUserId = result.insertId;
            console.log("✅ Usuario registrado en AlwaysData con ID:", alwaysDataUserId);
        } else {
            console.error("❌ Error en registro AlwaysData:", alwaysDataResult.reason);
        }

        // Si al menos uno fue exitoso, retornar ese ID
        return localUserId || alwaysDataUserId || 0;

    } catch (error) {
        console.error("❌ Error en registerUser:", error);
        throw error;
    }
};