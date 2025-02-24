import mongoose, { Schema, Document, Model } from 'mongoose';
import { atlasConnection, localConnection } from '../config/mongo';

export interface IRating extends Document {
  festivalId: number;
  rating: number;
}

const ratingSchema: Schema = new Schema({
  festivalId: { type: Number, required: true },
  rating: { type: Number, default: 0 },
});

// Modelo para conexión local (siempre disponible)
export const RatingLocal = localConnection.model<IRating>('Rating', ratingSchema);

// Modelo para Atlas (condicionalmente disponible)
export let RatingAtlas: Model<IRating>;

// Solo creamos el modelo Atlas si la conexión está disponible
if (atlasConnection) {
  RatingAtlas = atlasConnection.model<IRating>('Rating', ratingSchema);
} else {
  // Fallback - usar el modelo local cuando Atlas no está disponible
  RatingAtlas = RatingLocal;
}