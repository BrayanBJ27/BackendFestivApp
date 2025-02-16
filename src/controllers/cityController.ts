import { Request, Response } from 'express';
import { getCitiesByProvince } from '../models/cityModel';

export const getCities = async (req: Request, res: Response): Promise<void> => {
  try {
    const { province } = req.query;
    
    if (!province || typeof province !== 'string') {
      res.status(400).json({ error: 'El parámetro "province" es obligatorio y debe ser una cadena.' });
      return;
    }
    
    const result = await getCitiesByProvince(province);
    
    // Verificar que ambas consultas hayan devuelto datos
    if (!result.local || !result.remote) {
      res.status(500).json({ 
        error: 'Error al obtener ciudades de una o ambas bases de datos',
        local: !!result.local,
        remote: !!result.remote
      });
      return;
    }
    
    // Devolver la respuesta (se puede elegir la fuente principal, por ejemplo remote)
    res.json({
      local: result.local,
      remote: result.remote,
      data: result.remote
    });
  } catch (error) {
    console.error('Error in getCities:', error);
    res.status(500).json({ error: 'Error al obtener las ciudades' });
  }
};
