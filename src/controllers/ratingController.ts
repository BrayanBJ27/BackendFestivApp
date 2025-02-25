import { Request, Response } from 'express';
import { RatingAtlas, RatingLocal } from '../models/ratingModel';

export const updateFestivalRating = async (req: Request, res: Response): Promise<void> => {
  try {
    const { festivalId, rating } = req.body;
    if (!festivalId || rating == null) {
      res.status(400).json({ error: 'festivalId and rating are required' });
      return;
    }
    // Opciones para upsert
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };

    // Ejecuta la actualización en ambas fuentes de MongoDB simultáneamente
    const [resultAtlas, resultLocal] = await Promise.allSettled([
      RatingAtlas.findOneAndUpdate({ festivalId }, { rating }, options),
      RatingLocal.findOneAndUpdate({ festivalId }, { rating }, options)
    ]);

    // De las dos respuestas, se toma el rating obtenido (si alguna fue exitosa)
    let updatedRating = rating;
    if (resultAtlas.status === 'fulfilled' && resultAtlas.value) {
      updatedRating = resultAtlas.value.rating;
    } else if (resultLocal.status === 'fulfilled' && resultLocal.value) {
      updatedRating = resultLocal.value.rating;
    }

    res.json({ message: 'Rating updated', rating: updatedRating });
  } catch (error) {
    console.error('Error updating festival rating:', error);
    res.status(500).json({ error: 'Error updating festival rating' });
  }
};
