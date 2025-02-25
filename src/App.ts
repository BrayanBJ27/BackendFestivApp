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
import eventRoutes from './routes/eventRoutes';
import ratingRoutes from './routes/ratingRoutes';
import notificationRoutes from './routes/notificationRoutes';
import deviceTokenRoutes from './routes/deviceTokenRoutes';

const app = express();

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

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

// Rutas para eventos
app.use('/events', eventRoutes);

// Rutas para ratings
app.use('/ratings', ratingRoutes);

// Rutas para notificaciones
app.use('/notifications', notificationRoutes);

// Rutas para dispositivos
app.use('/devices', deviceTokenRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Conectar a MongoDB
connectMongo();

// Manejador de errores global
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error global:', err);
    res.status(err.status || 500).json({
      message: err.message || 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? err : {}
    });
  });

// Probar conexiones a las bases de datos
testConnections()
    .catch((err) => console.error('❌ Database connection error:', err));

export default app;