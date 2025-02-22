import { Request, Response } from 'express';
import { registerUserInDB, checkUserExists, getUserById, updateUserInDB } from '../models/userModel';
import { hashPassword } from '../config/auth';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password } = req.body;

        // Validaciones básicas
        if (!name || !email || !password) {
            res.status(400).json({ 
                success: false,
                error: 'All fields are required' 
            });
            return;
        }

        // Verificar si el usuario ya existe
        const userExists = await checkUserExists(email);
        if (userExists) {
            res.status(409).json({ // 409 Conflict
                success: false,
                error: 'This email is already registered'
            });
            return;
        }

        // Hash de la contraseña
        const hashedPassword = await hashPassword(password);

        // Registrar usuario
        const userId = await registerUserInDB(name, email, hashedPassword);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            userId
        });
    } catch (error) {
        console.error('Error in user registration:', error);
        res.status(500).json({
            success: false,
            error: 'Server error during registration'
        });
    }
};

export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      let { name, email, password, image } = req.body;
  
      const currentUser = await getUserById(Number(id));
      if (!currentUser) {
        res.status(404).json({ success: false, error: 'Usuario no encontrado' });
        return;
      }
  
      // Si no se envía un campo, conservar el valor actual
      name = name || currentUser.name_User;
      email = email || currentUser.email_User;
      image = image || currentUser.image;
  
      // Si se envía password, hashearlo; si no, conservarlo
      if (password) {
        password = await hashPassword(password);
      } else {
        password = currentUser.password_User;
      }
  
      const updated = await updateUserInDB(Number(id), name, email, password, image);
      if (updated) {
        const updatedUser = await getUserById(Number(id));
        res.status(200).json({ success: true, user: updatedUser });
      } else {
        res.status(400).json({ success: false, error: 'No se pudo actualizar el perfil' });
      }
    } catch (error) {
      console.error("Error actualizando el perfil:", error);
      res.status(500).json({ success: false, error: 'Error en el servidor' });
    }
};

export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const user = await getUserById(Number(id));
      if (!user) {
        res.status(404).json({ success: false, error: 'Usuario no encontrado' });
        return;
      }
      res.status(200).json({ success: true, user });
    } catch (error) {
      console.error("Error obteniendo perfil:", error);
      res.status(500).json({ success: false, error: 'Error en el servidor' });
    }
  };