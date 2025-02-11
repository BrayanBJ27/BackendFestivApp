import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import connectMongo from './config/mongo';
import poolPromise from './config/db';
import festivalRoutes from './routes/festivalRoutes';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Rutas de festivales
app.use('/festivals', festivalRoutes);

// Rutas de autenticación
app.use('/auth', authRoutes);

// Ruta para usuarios
app.use('/users', userRoutes);

// Conectar a MongoDB
connectMongo();

// 🔹 Esperar la conexión a MySQL
poolPromise
    .then(async (pool) => {
        const connection = await pool.getConnection();
        console.log('✅ Connected to MySQL');
        connection.release();
    })
    .catch((err) => console.error('❌ MySQL connection error:', err));

export default app;