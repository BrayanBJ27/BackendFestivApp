import mongoose, { Schema, Document, Model } from 'mongoose';
import { atlasConnection, localConnection } from '../config/mongo';

export interface IRating extends Document {
  festivalId: number;
  rating: number;
}

const ratingSchema: Schema = new Schema({
  festivalId: { type: Number, required: true },
  rating: { type: Number, default: 0 },
}, {
  collection: 'Ratings' 
});

// Modelo para conexión local
export const RatingLocal = localConnection.model<IRating>(
  'Rating', 
  ratingSchema
);

// Modelo para Atlas
export let RatingAtlas: Model<IRating>;

if (atlasConnection) {
  RatingAtlas = atlasConnection.model<IRating>(
    'Rating',
    ratingSchema
  );
} else {
  RatingAtlas = RatingLocal;
}
