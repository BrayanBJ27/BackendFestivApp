// festivityController.ts
import { Request, Response } from 'express';
import { createNewFestival as createNewFestivalModel, getFestivals } from '../models/festivityModel';

// Función para obtener todos los festivales
export const getAllFestivals = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await getFestivals();
        res.json({
            local: result.local,
            remote: result.remote,
            data: result.remote
        });
    } catch (error) {
        console.error('Error fetching festivals:', error);
        res.status(500).json({ error: 'Error fetching festivals' });
    }
};

// Función para crear un nuevo festival
export const createNewFestival = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            name,
            description,
            startDate,
            endDate,
            id_festival_type,
            id_location,
            image
        } = req.body;

        // Validación de campos requeridos
        if (!name || !description || !startDate || !endDate || !id_festival_type || !id_location) {
            res.status(400).json({
                error: 'Missing required fields',
                received: {
                    name: !!name,
                    description: !!description,
                    startDate: !!startDate,
                    endDate: !!endDate,
                    id_festival_type: !!id_festival_type,
                    id_location: !!id_location
                }
            });
            return;
        }

        // Parsear las fechas
        const start_date = new Date(startDate).toISOString().split('T')[0];
        const end_date = new Date(endDate).toISOString().split('T')[0];

        // Validar que las fechas sean válidas
        if (isNaN(Date.parse(start_date)) || isNaN(Date.parse(end_date))) {
            res.status(400).json({ error: 'Invalid date format' });
            return;
        }

        // Convertir IDs a números
        const festivalTypeId = Number(id_festival_type);
        const locationId = Number(id_location);

        // Validar que los IDs sean números válidos
        if (isNaN(festivalTypeId) || isNaN(locationId)) {
            res.status(400).json({ error: 'Invalid ID format' });
            return;
        }

        const result = await createNewFestivalModel(
            name,               // name_Festival
            description,        // description_Festival
            start_date,        // start_date
            end_date,          // end_date
            festivalTypeId,    // id_festival_type
            locationId,        // id_location
            image || null      // image (puede ser null)
        );

        res.status(201).json({
            message: 'Festival created successfully',
            local: result.local,
            remote: result.remote
        });

    } catch (error) {
        console.error('Error creating festival:', error);
        res.status(500).json({
            error: 'Error creating festival',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};