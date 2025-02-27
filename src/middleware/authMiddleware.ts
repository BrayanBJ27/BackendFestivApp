import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/express';
import admin from '../config/firebase';
import jwt from 'jsonwebtoken';
import poolPromise from '../config/db'; // Se espera que poolPromise devuelva un objeto con { localPool, alwaysDataPool }

const SECRET_KEY = process.env.JWT_SECRET || 'supersecretkey';

export const verifyFirebaseToken = async (
  req: AuthenticatedRequest, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Verificar el token de Firebase
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { email } = decodedToken;

    // Esperar la conexión a los pools
    const pool = await poolPromise; // pool tiene las propiedades: localPool y alwaysDataPool

    // Ejecutar consultas en paralelo en ambos pools
    const [localResult, alwaysDataResult]: any = await Promise.all([
      pool.localPool.query('SELECT * FROM Admins WHERE email = ?', [email]),
      pool.alwaysDataPool.query('SELECT * FROM Admins WHERE email = ?', [email])
    ]);

    // Cada consulta devuelve un array, donde el primer elemento son las filas
    const localRows = localResult[0];
    const alwaysDataRows = alwaysDataResult[0];

    // Combinar ambos resultados
    const userRows = [...localRows, ...alwaysDataRows];

    if (userRows.length === 0) {
      res.status(403).json({ error: 'User not found in MySQL' });
      return;
    }

    const user = userRows[0];

    // Generar un JWT personalizado
    const mySQLToken = jwt.sign(
      { id_admin: user.id_admin, email: user.email },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    // Agregar el usuario a la solicitud
    req.user = { id: user.id_admin, email: user.email, token: mySQLToken };

    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid Firebase Token' });
    return;
  }
};
