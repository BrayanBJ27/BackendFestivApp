import { localPool, alwaysDataPool } from '../config/db';
import { User } from '../types/user';
import { ResultSetHeader } from 'mysql2';

export const registerUserInDB = async (
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

export const checkUserExists = async (email: string): Promise<boolean> => {
    try {
        // Verificar en ambas bases de datos
        const [localResult, alwaysDataResult] = await Promise.all([
            localPool.query<ResultSetHeader[]>(
                'SELECT id_user FROM Users WHERE email_User = ?',
                [email]
            ),
            alwaysDataPool.query<ResultSetHeader[]>(
                'SELECT id_user FROM Users WHERE email_User = ?',
                [email]
            )
        ]);

        // Si existe en cualquiera de las dos bases de datos, retornar true
        return (localResult[0] as any[]).length > 0 || (alwaysDataResult[0] as any[]).length > 0;
    } catch (error) {
        console.error("❌ Error checking user existence:", error);
        throw error;
    }
};