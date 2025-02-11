import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/express';
import admin from '../config/firebase';
import jwt from 'jsonwebtoken';
import poolPromise from '../config/db'; // Asegurarse de que estamos importando `poolPromise`

const SECRET_KEY = process.env.JWT_SECRET || 'supersecretkey';

export const verifyFirebaseToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        // Verificar token de Firebase
        const decodedToken = await admin.auth().verifyIdToken(token);
        const { email } = decodedToken;

        // Obtener la conexión al pool de MySQL
        const pool = await poolPromise; // 🔹 Esperamos la conexión antes de usar `.query()`

        // Buscar usuario en MySQL
        const [userRows]: any = await pool.query('SELECT * FROM Admins WHERE email = ?', [email]);

        if (userRows.length === 0) {
            res.status(403).json({ error: 'User not found in MySQL' });
            return;
        }

        const user = userRows[0];

        // Generar JWT personalizado
        const mySQLToken = jwt.sign(
            { id_admin: user.id_admin, email: user.email },
            SECRET_KEY,
            { expiresIn: '1h' }
        );

        // Agregar `user` a la solicitud
        req.user = { id: user.id_admin, email: user.email, token: mySQLToken };

        // Continuar con la siguiente función en la ruta
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid Firebase Token' });
        return;
    }
};
