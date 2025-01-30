import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

admin.initializeApp({
    credential: admin.credential.cert(require('./firebase-service.json'))
});

export default admin;
