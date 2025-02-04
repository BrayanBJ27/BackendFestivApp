import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Prueba de conexión a AlwaysData
const testConnection = async () => {
    try {
      const connection = await pool.getConnection();
      console.log("✅ Conexión a AlwaysData exitosa");
      connection.release();
    } catch (err) {
      console.error("❌ Error de conexión:", err);
    }
  };
  
  // Ejecutar la prueba
  testConnection();

export default pool;
