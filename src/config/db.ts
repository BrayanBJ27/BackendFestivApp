import mysql, { Pool } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Configuración AlwaysData
const alwaysDataConfig = {
    host: process.env.ALWAYS_DB_HOST,
    user: process.env.ALWAYS_DB_USER,
    password: process.env.ALWAYS_DB_PASS,
    database: process.env.ALWAYS_DB_NAME,
    port: Number(process.env.ALWAYS_DB_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Configuración Local
const localDBConfig = {
    host: process.env.LOCAL_DB_HOST || 'localhost',
    user: process.env.LOCAL_DB_USER || 'root',
    password: process.env.LOCAL_DB_PASS || '',
    database: process.env.LOCAL_DB_NAME || 'festivapp',
    port: Number(process.env.LOCAL_DB_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Función para probar AlwaysData y decidir qué base de datos usar
const testConnection = async (): Promise<Pool> => {
    try {
        const connection = await mysql.createConnection(alwaysDataConfig);
        console.log('✅ Conexión exitosa a AlwaysData');
        await connection.end();
        return mysql.createPool(alwaysDataConfig); // Si AlwaysData funciona, crea el pool con AlwaysData
    } catch (error) {
        console.error('⚠ No se pudo conectar a AlwaysData. Usando la base de datos local.');
        return mysql.createPool(localDBConfig); // Si falla, usa la base de datos local
    }
};

// Exportar la promesa del pool
const poolPromise = testConnection();

export default poolPromise;
