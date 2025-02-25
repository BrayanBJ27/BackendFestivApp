import { localPool, alwaysDataPool } from '../config/db';
import { Pool } from 'mysql2/promise';
import { RatingAtlas, RatingLocal } from './ratingModel';

// Interface for database operations result
interface DbOperationResult {
    local: any;
    remote: any;
}

// Helper function to execute query on both databases
async function executeOnBothDbs(
    query: string,
    params: any[] = [],
): Promise<DbOperationResult> {
    try {
        // Execute queries in parallel
        const [localResult, remoteResult] = await Promise.all([
            localPool.query(query, params),
            alwaysDataPool.query(query, params)
        ]);

        return {
            local: localResult[0],
            remote: remoteResult[0]
        };
    } catch (error) {
        console.error('❌ Error executing on both databases:', error);
        throw error;
    }
}

// Get all festival from both databases
export const getFestivals = async (): Promise<DbOperationResult> => {
    try {
        const query = `
            SELECT f.*, ft.name_FType, l.city, l.province 
            FROM Festivals f
            LEFT JOIN FestivalTypes ft ON f.id_festival_type = ft.id_festival_type
            LEFT JOIN Locations l ON f.id_location = l.id_location
        `;
        return await executeOnBothDbs(query);
    } catch (error) {
        console.error('❌ Error in getFestivals:', error);
        throw error;
    }
};

// Función para obtener un festival por su id
export const getFestivalById = async (id: number): Promise<any> => {
    const query = `
      SELECT f.*, ft.name_FType, l.city, l.province 
      FROM Festivals f
      LEFT JOIN FestivalTypes ft ON f.id_festival_type = ft.id_festival_type
      LEFT JOIN Locations l ON f.id_location = l.id_location
      WHERE f.id_festival = ?
    `;
    const result = await executeOnBothDbs(query, [id]);
    // Suponiendo que los resultados sean iguales en ambas bases,
    // se podría retornar uno de ellos o fusionar la información según sea necesario
    return result.remote[0] || result.local[0];
  };

  // Función para actualizar un festival
export const updateFestival = async (id: number, data: any): Promise<any> => {
    const query = `
      UPDATE Festivals 
      SET name_Festival = ?, 
          description_Festival = ?, 
          start_date = ?, 
          end_date = ?, 
          id_festival_type = ?, 
          id_location = ?,
          image = ?
      WHERE id_festival = ?
    `;
    return await executeOnBothDbs(query, [
      data.name_Festival,
      data.description_Festival,
      data.start_date,
      data.end_date,
      data.id_festival_type,
      data.id_location,
      data.image,
      id
    ]);
  };

  // Función para eliminar un festival
export const deleteFestival = async (id: number): Promise<any> => {
    const query = `DELETE FROM Festivals WHERE id_festival = ?`;
    return await executeOnBothDbs(query, [id]);
  };

// Create festival type in both databases
export const createNewFestival = async (
    name_Festival: string,
    description_Festival: string,
    start_date: string,
    end_date: string,
    id_festival_type: number,
    id_location: number,
    image: string | null
): Promise<DbOperationResult> => {
    try {
        const query = `
            INSERT INTO Festivals (
                name_Festival, 
                description_Festival, 
                start_date, 
                end_date, 
                id_festival_type, 
                id_location, 
                image
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        const imageBuffer = image ? Buffer.from(image, 'base64') : null;
        
        return await executeOnBothDbs(query, [
            name_Festival,
            description_Festival,
            start_date,
            end_date,
            id_festival_type,
            id_location,
            imageBuffer
        ]);
    } catch (error) {
        console.error('❌ Error in createFestival:', error);
        throw error;
    }
};

// Helper function to verify data consistency between databases
export const verifyConsistency = async (): Promise<boolean> => {
    try {
        const { local, remote } = await getFestivals();
        
        // Simple length comparison
        if (local.length !== remote.length) {
            console.warn('⚠️ Database inconsistency detected: Different number of records');
            return false;
        }

        // More detailed comparison could be implemented here
        return true;
    } catch (error) {
        console.error('❌ Error verifying consistency:', error);
        return false;
    }
};

// Función para obtener un festival por su id y agregar el rating desde MongoDB
export const getFestivalDetailsById = async (id: number): Promise<any> => {
    const query = `
      SELECT 
            f.id_festival, 
            f.name_Festival, 
            f.description_Festival, 
            f.start_date, 
            f.end_date, 
            f.image,
            ft.name_FType,
            l.city,
            l.province
            FROM Festivals f
            LEFT JOIN FestivalTypes ft ON f.id_festival_type = ft.id_festival_type
            LEFT JOIN Locations l ON f.id_location = l.id_location
            WHERE f.id_festival = ?
    `;
    const result = await executeOnBothDbs(query, [id]);
    // Se asume que los resultados de ambas fuentes son iguales; usamos el remoto o el local
    const festival = result.remote[0] || result.local[0];
    if (!festival) return null;
  
    // Convertir la imagen a Base64 si existe
    if (festival.image) {
      festival.image = Buffer.from(festival.image).toString('base64');
    }
  
    // Consultar en ambas conexiones de MongoDB para obtener el rating
    const results = await Promise.allSettled([
      RatingAtlas.findOne({ festivalId: id }),
      RatingLocal.findOne({ festivalId: id })
    ]);
  
    let rating = 0;
    results.forEach(res => {
      if (res.status === 'fulfilled' && res.value && res.value.rating > rating) {
        rating = res.value.rating;
      }
    });
    festival.rating = rating;
    return festival;
  };