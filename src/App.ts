import express, { Application } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import connectMongo from './config/mongo';
import pool from './config/db';
import festivalRoutes from './routes/festivalRoutes';

const app: Application = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Rutas
app.use('/festivals', festivalRoutes);

// Conexiones
connectMongo();
pool.getConnection()
    .then(() => console.log('Connected to MySQL'))
    .catch((err) => console.error('MySQL connection error:', err));

export default app;
