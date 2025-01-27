import { Request, Response } from 'express';
import { getFestivals, getFestivalById, createFestival } from '../models/festivalModel';

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
        const id = await createFestival(req.body);
        res.status(201).json({ message: 'Festival created', id });
    } catch (error) {
        res.status(500).json({ error: 'Error creating the festival' });
    }
};
