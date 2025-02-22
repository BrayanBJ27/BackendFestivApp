import { Request, Response } from 'express';
import { 
  createEvent as createEventModel,
  getEventsByFestival as getEventsByFestivalModel,
  updateEvent as updateEventModel,
  getEventById as getEventByIdModel,
  deleteEvent as deleteEventModel
} from '../models/eventModel';

// Obtiene los eventos filtrados por el id de la festividad
export const getEventsByFestival = async (req: Request, res: Response): Promise<void> => {
  try {
    const { festivityId } = req.query;
    if (!festivityId) {
      res.status(400).json({ error: 'festivityId query parameter is required' });
      return;
    }
    const events = await getEventsByFestivalModel(Number(festivityId));
    res.json(events);
  } catch (error) {
    console.error('Error fetching events by festival:', error);
    res.status(500).json({ error: 'Error fetching events' });
  }
};

export const createEvent = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name_Event, description_Event, event_date, id_festival, location } = req.body;
      if (!name_Event || !description_Event || !event_date || !id_festival || !location) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }
      // Se espera que event_date venga en el formato "YYYY-MM-DD HH:MM:SS"
      const [datePart, timePart] = event_date.split(' ');
      if (!datePart || !timePart) {
        res.status(400).json({ error: 'Invalid event_date format. Expected "YYYY-MM-DD HH:MM:SS"' });
        return;
      }
      const result = await createEventModel(
        name_Event, 
        description_Event, 
        datePart, 
        timePart, 
        Number(id_festival), 
        location
      );
      res.status(201).json({ message: 'Event created successfully', data: result });
    } catch (error) {
      console.error('Error creating event:', error);
      res.status(500).json({ error: 'Error creating event' });
    }
  };

  // Obtiene un evento por su ID
export const getEventById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const event = await getEventByIdModel(Number(id));
      if (!event) {
        res.status(404).json({ error: 'Event not found' });
        return;
      }
      res.json(event);
    } catch (error) {
      console.error('Error fetching event:', error);
      res.status(500).json({ error: 'Error fetching event' });
    }
  };

  // Actualiza un evento
export const updateEvent = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { name_Event, description_Event, event_date, id_festival, location } = req.body;
      if (!name_Event || !description_Event || !event_date || !id_festival || !location) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }
      // Se espera event_date en formato "YYYY-MM-DD HH:MM:SS"
      const [datePart, timePart] = event_date.split(' ');
      if (!datePart || !timePart) {
        res.status(400).json({ error: 'Invalid event_date format. Expected "YYYY-MM-DD HH:MM:SS"' });
        return;
      }
      const result = await updateEventModel(Number(id), name_Event, description_Event, datePart, timePart, Number(id_festival), location);
      res.json({ message: 'Event updated successfully', data: result });
    } catch (error) {
      console.error('Error updating event:', error);
      res.status(500).json({ error: 'Error updating event' });
    }
  };

  export const deleteEvent = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await deleteEventModel(Number(id));
      res.json({ message: 'Event deleted successfully' });
    } catch (error) {
      console.error('Error deleting event:', error);
      res.status(500).json({ error: 'Error deleting event' });
    }
  };