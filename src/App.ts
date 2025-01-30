import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import connectMongo from './config/mongo';
import pool from './config/db';
import festivalRoutes from './routes/festivalRoutes';
import authRoutes from './routes/authRoutes';

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Rutas de festivales
app.use('/festivals', festivalRoutes);

// Rutas de autenticación
app.use('/auth', authRoutes);

connectMongo();

pool.getConnection()
    .then(() => console.log('Connected to MySQL'))
    .catch((err) => console.error('MySQL connection error:', err));

export default app;
