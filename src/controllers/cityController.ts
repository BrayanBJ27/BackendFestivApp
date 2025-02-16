import { Request, Response } from 'express';
import { getCitiesByProvince, getLocationIdByCityAndProvince } from '../models/cityModel';

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

export const getLocationId = async (req: Request, res: Response): Promise<void> => {
    try {
      const { city, province } = req.query;
      
      if (!city || !province || typeof city !== 'string' || typeof province !== 'string') {
        res.status(400).json({ error: 'City and province parameters are required' });
        return;
      }
      
      const result = await getLocationIdByCityAndProvince(city, province);
      
      if (!result.remote?.[0]) {
        res.status(404).json({ error: 'Location not found' });
        return;
      }
      
      res.json({
        id_location: result.remote[0].id_location,
        message: 'Location ID found successfully'
      });
    } catch (error) {
      console.error('Error in getLocationId:', error);
      res.status(500).json({ error: 'Error getting location ID' });
    }
  };