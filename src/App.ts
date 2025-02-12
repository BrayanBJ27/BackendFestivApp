import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import connectMongo from './config/mongo';
import { testConnections } from './config/db';
import typeFestivalRoutes from './routes/typeFestivalRoutes';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Rutas de festivales
app.use('/typefestival', typeFestivalRoutes);

// Rutas de autenticación
app.use('/auth', authRoutes);

// Ruta para usuarios
app.use('/users', userRoutes);

// Conectar a MongoDB
connectMongo();

// Probar conexiones a las bases de datos
testConnections()
    .catch((err) => console.error('❌ Database connection error:', err));

export default app;