import { Schema, Document, Model } from 'mongoose';
import { atlasConnection, localConnection } from '../config/mongo';

export interface INotification extends Document {
  festivalId: number;
  message: string;
  createdAt: Date;
  status: string;
}

const notificationSchema: Schema = new Schema(
  {
    festivalId: { type: Number, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    status: { type: String, default: 'pending' },
  },
  {
    collection: 'Notifications',
  }
);

// Modelo para conexión local
export const NotificationLocal: Model<INotification> = localConnection.model<INotification>(
  'Notification',
  notificationSchema
);

// Modelo para Atlas (si está disponible)
export let NotificationAtlas: Model<INotification>;
if (atlasConnection) {
  NotificationAtlas = atlasConnection.model<INotification>('Notification', notificationSchema);
} else {
  NotificationAtlas = NotificationLocal;
}
