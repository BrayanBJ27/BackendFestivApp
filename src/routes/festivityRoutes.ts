import { Router } from 'express';
import express from 'express';
import { 
  getAllFestivals, 
  getFestivalById, 
  createNewFestival, 
  updateFestival, 
  deleteFestival, 
  getLatestFestivals,
  getFestivalDetails,
} from '../controllers/festivityController';

const router = Router();

// Configurar middleware para aumentar límite solo en rutas específicas
const largeJsonParser = express.json({ limit: '100mb' });
const largeUrlEncodedParser = express.urlencoded({ limit: '100mb', extended: true });

// Rutas GET (mantienen la configuración predeterminada)
router.get('/list', getAllFestivals);
router.get('/latest', getLatestFestivals);
router.get('/:id', getFestivalById);
router.get('/detail/:id', getFestivalDetails);

// Rutas POST y PUT con límites aumentados
router.post('/register', largeJsonParser, largeUrlEncodedParser, createNewFestival);
router.put('/:id', largeJsonParser, largeUrlEncodedParser, updateFestival);  

// Ruta DELETE (mantiene la configuración predeterminada)
router.delete('/:id', deleteFestival);

export default router;