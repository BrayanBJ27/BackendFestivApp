import { Request, Response } from 'express';
import { getProvince } from '../models/provinceModel';

export const getAllProvince = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await getProvince();
        
        // Verificar si ambas bases de datos devolvieron datos
        if (!result.local || !result.remote) {
            res.status(500).json({ 
                error: 'Error fetching provinces from one or both databases',
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
        console.error('Error in getProvinces:', error);
        res.status(500).json({ error: 'Error fetching provinces' });
    }
};