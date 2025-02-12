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

// Crear pools para ambas bases de datos
export const localPool = mysql.createPool(localDBConfig);
export const alwaysDataPool = mysql.createPool(alwaysDataConfig);

// Función para probar las conexiones
export const testConnections = async () => {
    try {
        const localConnection = await localPool.getConnection();
        console.log('✅ Conexión exitosa a la base de datos local');
        localConnection.release();
    } catch (error) {
        console.error('❌ Error conectando a la base de datos local:', error);
    }

    try {
        const alwaysConnection = await alwaysDataPool.getConnection();
        console.log('✅ Conexión exitosa a AlwaysData');
        alwaysConnection.release();
    } catch (error) {
        console.error('❌ Error conectando a AlwaysData:', error);
    }
};

// Ya no necesitamos exportar poolPromise
export default { localPool, alwaysDataPool };