// festivityController.ts
import { Request, Response } from 'express';
import { 
  createNewFestival as createNewFestivalModel, 
  getFestivals, 
  getFestivalById as getFestivalByIdModel,
  updateFestival as updateFestivalModel,
  deleteFestival as deleteFestivalModel
} from '../models/festivityModel';

// Función para obtener todos los festivales
export const getAllFestivals = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await getFestivals();

        // Convertir cada "image" de Buffer a Base64 en local y remote
        const localFestivals = (result.local || []).map((festival: any) => ({
            ...festival,
            image: festival.image ? Buffer.from(festival.image).toString('base64') : null
        }));

        const remoteFestivals = (result.remote || []).map((festival: any) => ({
            ...festival,
            image: festival.image ? Buffer.from(festival.image).toString('base64') : null
        }));

        res.json({
            local: localFestivals,
            remote: remoteFestivals,
            data: remoteFestivals
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

// Función para obtener un festival por id
export const getFestivalById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const festival = await getFestivalByIdModel(Number(id));
      if (!festival) {
        res.status(404).json({ error: 'Festival not found' });
        return;
      }
      // Si hay imagen, convertir Buffer a Base64
      if (festival.image) {
        festival.image = Buffer.from(festival.image).toString('base64');
      }
      res.json(festival);
    } catch (error) {
      console.error('Error fetching festival:', error);
      res.status(500).json({ error: 'Error fetching festival' });
    }
  };

 // Función para actualizar un festival
export const updateFestival = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const {
        name_Festival,
        description_Festival,
        start_date,
        end_date,
        id_festival_type,
        id_location,
        image
      } = req.body;
  
      // Validación de campos obligatorios (puedes agregar más validaciones según sea necesario)
      if (!name_Festival || !description_Festival || !start_date || !end_date || !id_festival_type || !id_location) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }
  
      // Convertir fechas a formato ISO (solo fecha)
      const formattedStartDate = new Date(start_date).toISOString().split('T')[0];
      const formattedEndDate = new Date(end_date).toISOString().split('T')[0];
  
      // Procesar la imagen, convirtiéndola a Buffer si se envía en base64
      const processedImage = image ? Buffer.from(image, 'base64') : null;
  
      // Crear objeto con los datos actualizados
      const updatedData = {
        name_Festival,
        description_Festival,
        start_date: formattedStartDate,
        end_date: formattedEndDate,
        id_festival_type: Number(id_festival_type),
        id_location: Number(id_location),
        image: processedImage
      };
  
      // Llamada al modelo para actualizar el festival en ambas bases de datos
      const result = await updateFestivalModel(Number(id), updatedData);
  
      res.json({
        message: 'Festival updated successfully',
        local: result.local,
        remote: result.remote
      });
    } catch (error) {
      console.error('Error updating festival:', error);
      res.status(500).json({ error: 'Error updating festival' });
    }
  };  

  // Función para eliminar un festival
export const deleteFestival = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await deleteFestivalModel(Number(id));
      res.json({
        message: 'Festival deleted successfully',
        local: result.local,
        remote: result.remote
      });
    } catch (error) {
      console.error('Error deleting festival:', error);
      res.status(500).json({ error: 'Error deleting festival' });
    }
  };