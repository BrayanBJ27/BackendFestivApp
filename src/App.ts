import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import connectMongo from './config/mongo';
import { testConnections } from './config/db';
import typeFestivalRoutes from './routes/typeFestivalRoutes';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import provinceRoutes from './routes/provinceRoutes';
import cityRoutes from './routes/cityRoutes';
import festivityRoutes from './routes/festivityRoutes';

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Rutas de festivales
app.use('/typefestival', typeFestivalRoutes);

//Rutas para festividades
app.use('/festivals', festivityRoutes);

// Rutas de autenticación
app.use('/auth', authRoutes);

// Ruta para usuarios
app.use('/users', userRoutes);

// Rutas para provincias
app.use('/provinces', provinceRoutes);

// Ruta para ciudad
app.use('/cities', cityRoutes);

// Conectar a MongoDB
connectMongo();

// Probar conexiones a las bases de datos
testConnections()
    .catch((err) => console.error('❌ Database connection error:', err));

export default app;