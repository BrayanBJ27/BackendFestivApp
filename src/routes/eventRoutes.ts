import { Router } from 'express';
import { 
    createEvent, 
    getEventById, 
    updateEvent, 
    getEventsByFestival,
    deleteEvent 
  } from '../controllers/eventController';

const router = Router();

// Endpoint para los eventos
router.post('/register', createEvent);
router.get('/byFestival', getEventsByFestival);
router.get('/:id', getEventById);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);

export default router;
