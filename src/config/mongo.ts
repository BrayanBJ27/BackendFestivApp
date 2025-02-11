import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// URI de conexión a MongoDB Atlas y Local
const MONGO_ATLAS_URI = process.env.MONGO_ATLAS_URI || 'mongodb+srv://FestivApp:adminFA25%2A@festivapp.kuusk.mongodb.net/?retryWrites=true&w=majority&appName=FestivApp';
const MONGO_LOCAL_URI = process.env.MONGO_LOCAL_URI || 'mongodb://localhost:27017/FestivApp';

// Función para conectar a MongoDB
const connectMongo = async () => {
    try {
        // Intentar conectar primero a MongoDB Atlas
        await mongoose.connect(MONGO_ATLAS_URI);
        console.log('✅ Conectado a MongoDB Atlas');
    } catch (error) {
        console.error('⚠ No se pudo conectar a MongoDB Atlas. Intentando con MongoDB local...');
        
        try {
            // Si falla Atlas, intentar con la base de datos local
            await mongoose.connect(MONGO_LOCAL_URI);
            console.log('✅ Conectado a MongoDB local');
        } catch (err) {
            console.error('❌ Error al conectar a MongoDB:', err);
        }
    }
};

export default connectMongo;