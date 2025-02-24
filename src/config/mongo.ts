import mongoose, { Connection } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_ATLAS_URI = process.env.MONGO_ATLAS_URI;
const MONGO_LOCAL_URI = process.env.MONGO_LOCAL_URI || 'mongodb://localhost:27017/FestivApp';

// Verificar que existe la variable de entorno para Atlas
if (!MONGO_ATLAS_URI) {
  console.warn('⚠️ La variable de entorno MONGO_ATLAS_URI no está configurada');
  console.warn('⚠️ La conexión a MongoDB Atlas no estará disponible');
}

// Conexión a MongoDB Atlas (solo si está configurada la variable de entorno)
export const atlasConnection = MONGO_ATLAS_URI 
  ? mongoose.createConnection(MONGO_ATLAS_URI)
  : null;

if (atlasConnection) {
  atlasConnection.on('connected', () => {
    console.log('✅ Connected to MongoDB Atlas');
  });
  atlasConnection.on('error', (err) => {
    console.error('❌ Atlas connection error:', err);
  });
}

// Conexión a MongoDB Local
export const localConnection = mongoose.createConnection(MONGO_LOCAL_URI);
localConnection.on('connected', () => {
  console.log('✅ Connected to MongoDB Local');
});
localConnection.on('error', (err) => {
  console.error('❌ Local connection error:', err);
});

// Define el tipo para las conexiones
interface Connections {
  localConnection: Connection;
  atlasConnection?: Connection | null;
}

// Función para establecer las conexiones
const connectMongo = async (): Promise<Connections> => {
  const connections: Connections = {
    localConnection,
    atlasConnection: atlasConnection
  };
  
  return connections;
};

export default connectMongo;