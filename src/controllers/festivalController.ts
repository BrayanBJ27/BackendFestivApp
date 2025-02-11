import { Request, Response } from 'express';
import { getFestivals, createFestival } from '../models/festivalModel';

export const getAllFestivals = async (req: Request, res: Response): Promise<void> => {
    try {
        const festivals = await getFestivals();
        res.json(festivals);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching festivals' });
    }
};

export const createNewFestival = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, description } = req.body; // ✅ Extraer name y description
        if (!name || !description) {
            res.status(400).json({ error: 'Name and description are required' });
            return;
        }

        const id = await createFestival(name, description); // ✅ Pasar los valores correctos
        res.status(201).json({ message: 'Festival created', id });
    } catch (error) {
        res.status(500).json({ error: 'Error creating the festival' });
    }
};
