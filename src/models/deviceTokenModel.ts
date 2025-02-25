import { Schema, Document } from 'mongoose';
import { atlasConnection, localConnection } from '../config/mongo';

export interface IDeviceToken extends Document {
  token: string;
  userId?: number;
  createdAt: Date;
  updatedAt?: Date;
}

// Definir el esquema
const deviceTokenSchema = new Schema({
  token: { type: String, required: true },
  userId: { type: Number },
}, {
  collection: 'DeviceTokens',
  timestamps: true // para createdAt y updatedAt automáticos
});

// Modelo en la base local
export const DeviceTokenLocal = localConnection.model<IDeviceToken>(
  'DeviceToken',
  deviceTokenSchema
);

// Modelo en Atlas
export const DeviceTokenAtlas = atlasConnection?.model<IDeviceToken>(
  'DeviceToken',
  deviceTokenSchema
) ?? DeviceTokenLocal; // fallback si atlasConnection es null
