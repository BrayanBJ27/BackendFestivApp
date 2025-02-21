import { Router } from 'express';
import { 
  getAllFestivals, 
  getFestivalById, 
  createNewFestival, 
  updateFestival, 
  deleteFestival 
} from '../controllers/festivityController';

const router = Router();

router.get('/list', getAllFestivals);
router.get('/:id', getFestivalById);      // Nueva ruta para obtener un festival por id
router.post('/register', createNewFestival);
router.put('/:id', updateFestival);         // Nueva ruta para actualizar un festival
router.delete('/:id', deleteFestival);      // Nueva ruta para eliminar un festival

export default router;
