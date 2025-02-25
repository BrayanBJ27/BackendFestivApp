import { Request, Response } from 'express';
import { DeviceTokenLocal, DeviceTokenAtlas } from '../models/deviceTokenModel';

export const registerDeviceToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, userId } = req.body;
    if (!token) {
      res.status(400).json({ error: 'Token is required' });
      return;
    }

    console.log(`Registering token: ${token} for user: ${userId || 'anonymous'}`);

    // Efectuamos la operación en ambas bases en paralelo
    const [atlasResult, localResult] = await Promise.allSettled([
      DeviceTokenAtlas.findOneAndUpdate(
        { token },
        { token, userId },
        { upsert: true, new: true, maxTimeMS: 30000 }
      ),
      DeviceTokenLocal.findOneAndUpdate(
        { token },
        { token, userId },
        { upsert: true, new: true, maxTimeMS: 30000 }
      )
    ]);

    // Revisar si hubo algún error
    let finalToken = token; // Valor a retornar
    let anyFulfilled = false;

    if (atlasResult.status === 'fulfilled' && atlasResult.value) {
      console.log(`Atlas upsert success: ${atlasResult.value._id}`);
      finalToken = atlasResult.value.token;
      anyFulfilled = true;
    } else if (atlasResult.status === 'rejected') {
      console.error('Atlas upsert error:', atlasResult.reason);
    }

    if (localResult.status === 'fulfilled' && localResult.value) {
      console.log(`Local upsert success: ${localResult.value._id}`);
      finalToken = localResult.value.token;
      anyFulfilled = true;
    } else if (localResult.status === 'rejected') {
      console.error('Local upsert error:', localResult.reason);
    }

    if (!anyFulfilled) {
      res.status(500).json({
        error: 'Error registering device token in both DBs',
        details: 'Both operations failed'
      });
      return;
    }

    // Si al menos una DB guardó correctamente, respondemos con éxito
    res.status(201).json({
      message: 'Token registered in both DBs (at least one success)',
      token: finalToken
    });
  } catch (error) {
    console.error('Error registering device token:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({
      error: 'Error registering device token',
      details: errorMessage
    });
  }
};
