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

export const getUserByEmail = async (email: string): Promise<User | null> => {
    try {
      const [rows] = await localPool.query("SELECT * FROM Users WHERE email_User = ?", [email]);
      if ((rows as any[]).length > 0) {
        return (rows as any[])[0];
      }
      return null;
    } catch (error) {
      console.error("Error obteniendo usuario:", error);
      throw error;
    }
};

// Obtener usuario por ID
export const getUserById = async (id: number): Promise<User | null> => {
    try {
      const [rows] = await localPool.query("SELECT * FROM Users WHERE id_user = ?", [id]);
      return (rows as any[]).length > 0 ? (rows as any[])[0] : null;
    } catch (error) {
      console.error("Error obteniendo usuario:", error);
      throw error;
    }
};

// Actualizar datos del usuario
export const updateUserInDB = async (
    id: number,
    name: string,
    email: string,
    password: string,
    image: string | null
  ): Promise<boolean> => {
    try {
      // Actualizar en paralelo ambas bases de datos
      const [localResult, alwaysDataResult] = await Promise.allSettled([
        localPool.query(
          `UPDATE Users SET name_User = ?, email_User = ?, password_User = ?, image = ? WHERE id_user = ?`,
          [name, email, password, image, id]
        ),
        alwaysDataPool.query(
          `UPDATE Users SET name_User = ?, email_User = ?, password_User = ?, image = ? WHERE id_user = ?`,
          [name, email, password, image, id]
        )
      ]);
  
      // Manejar resultados
      let localSuccess = false;
      let alwaysDataSuccess = false;
  
      // Verificar si la actualización en la DB local fue exitosa
      if (localResult.status === "fulfilled") {
        const [result] = localResult.value;
        localSuccess = (result as any).affectedRows > 0;
      } else {
        console.error("❌ Error actualizando en DB local:", localResult.reason);
      }
  
      // Verificar si la actualización en AlwaysData fue exitosa
      if (alwaysDataResult.status === "fulfilled") {
        const [result] = alwaysDataResult.value;
        alwaysDataSuccess = (result as any).affectedRows > 0;
      } else {
        console.error("❌ Error actualizando en AlwaysData:", alwaysDataResult.reason);
      }
  
      // Retornar true si al menos una de las dos fue exitosa
      return localSuccess || alwaysDataSuccess;
  
    } catch (error) {
      console.error("Error actualizando usuario:", error);
      throw error;
    }
  };