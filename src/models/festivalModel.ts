import poolPromise from '../config/db';

// Obtener todos los festivales
export const getFestivals = async (): Promise<any[]> => {
    try {
        const pool = await poolPromise; // 🔹 Espera la conexión antes de consultar
        const [rows]: [any[], any] = await pool.query('SELECT * FROM Festivals');
        return rows;
    } catch (error) {
        console.error('❌ Error en getFestivals:', error);
        throw error;
    }
};

// Agregar un nuevo festival
export const createFestival = async (name: string, description: string): Promise<number> => {
    try {
        const pool = await poolPromise; // 🔹 Espera la conexión antes de consultar
        const [result]: any = await pool.query(
            `INSERT INTO Festivals (name_Festival, description_Festival) VALUES (?, ?)`,
            [name, description]
        );
        return result.insertId;
    } catch (error) {
        console.error('❌ Error en createFestival:', error);
        throw error;
    }
};
