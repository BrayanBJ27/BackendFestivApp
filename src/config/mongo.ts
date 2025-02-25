import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_ATLAS_URI = process.env.MONGO_ATLAS_URI || 'mongodb+srv://FestivApp:adminFA25*@festivapp.kuusk.mongodb.net/FestivApp?retryWrites=true&w=majority&appName=FestivApp';
const MONGO_LOCAL_URI = process.env.MONGO_LOCAL_URI || 'mongodb://localhost:27017/FestivApp';

// Connection options with proper keepAlive settings
const connectionOptions: mongoose.ConnectOptions = {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 30000,
};

// Conexión a MongoDB Atlas
export let atlasConnection: mongoose.Connection | null = null;
try {
  atlasConnection = mongoose.createConnection(MONGO_ATLAS_URI, connectionOptions);

  atlasConnection.on('connected', () => {
    console.log('✅ Connected to MongoDB Atlas');
  });

  atlasConnection.on('error', (err) => {
    console.error('❌ Atlas connection error:', err);
  });

  atlasConnection.on('disconnected', () => {
    console.log('⚠️ MongoDB Atlas disconnected. Attempting to reconnect...');
    setTimeout(() => {
      atlasConnection = mongoose.createConnection(MONGO_ATLAS_URI, connectionOptions);
    }, 5000);
  });
} catch (error) {
  console.error('❌ Could not establish Atlas connection:', error);
  atlasConnection = null;
}

export let localConnection: mongoose.Connection;
try {
  localConnection = mongoose.createConnection(MONGO_LOCAL_URI, connectionOptions);

  localConnection.on('connected', () => {
    console.log('✅ Connected to MongoDB Local');
  });

  localConnection.on('error', (err) => {
    console.error('❌ Local connection error:', err);
  });

  localConnection.on('disconnected', () => {
    console.log('⚠️ MongoDB Local disconnected. Attempting to reconnect...');
    setTimeout(() => {
      localConnection = mongoose.createConnection(MONGO_LOCAL_URI, connectionOptions);
    }, 5000);
  });
} catch (error) {
  console.error('❌ Could not establish Local connection:', error);
  throw error;
}

export const setupPingInterval = (): void => {
  setInterval(async () => {
    try {
      // Para evitar el error de "db es possibly undefined", revisa readyState
      if (localConnection.readyState === 1) {
        await localConnection.db?.admin()?.ping();
        console.log('🔄 Pinged local MongoDB connection');
      }
      if (atlasConnection && atlasConnection.readyState === 1) {
        await atlasConnection.db?.admin()?.ping();
        console.log('🔄 Pinged Atlas MongoDB connection');
      }
    } catch (error) {
      console.error('❌ Error pinging MongoDB:', error);
    }
  }, 300000); // Cada 5 minutos
};

export const connectMongo = async (): Promise<void> => {
  try {
    await localConnection.asPromise();
    console.log('✅ Local MongoDB connection established');

    if (atlasConnection) {
      await atlasConnection.asPromise();
      console.log('✅ Atlas MongoDB connection established');
    }

    console.log('✅ All MongoDB connections established');
    setupPingInterval();
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error);
    throw error;
  }
};

export default connectMongo;