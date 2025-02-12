import { Request, Response } from 'express';
import { getTypeFestival, createTypeFestival } from '../models/typeFestivalModel';

export const getAllFestival = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await getTypeFestival();
        
        // Verificar si ambas bases de datos devolvieron datos
        if (!result.local || !result.remote) {
            res.status(500).json({ 
                error: 'Error fetching festivals from one or both databases',
                local: !!result.local,
                remote: !!result.remote
            });
            return;
        }

        // Devolver los datos de ambas bases de datos
        res.json({
            local: result.local,
            remote: result.remote,
            // Por defecto usar remote como fuente principal
            data: result.remote
        });
    } catch (error) {
        console.error('Error in getAllFestival:', error);
        res.status(500).json({ error: 'Error fetching festivals' });
    }
};

export const createNewTypeFestival = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name_FType, description_FType } = req.body; // Ajustar nombres de campos
        if (!name_FType) {
            res.status(400).json({ error: 'Festival type name is required' });
            return;
        }

        const result = await createTypeFestival(name_FType, description_FType || '');
        
        // Verificar si se insertó en ambas bases de datos
        if (!result.local || !result.remote) {
            res.status(500).json({ 
                error: 'Error creating festival type in one or both databases',
                local: !!result.local,
                remote: !!result.remote
            });
            return;
        }

        res.status(201).json({ 
            message: 'Festival type created successfully',
            local: result.local,
            remote: result.remote,
            // Usar el ID de la base de datos remota como referencia principal
            id: result.remote.insertId
        });
    } catch (error) {
        console.error('Error in createNewTypeFestival:', error);
        res.status(500).json({ error: 'Error creating the festival type' });
    }
};