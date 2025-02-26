import { localPool, alwaysDataPool } from '../config/db';

// Función auxiliar para ejecutar la consulta en ambas bases de datos (si se requiere)
async function executeOnBothDbs(query: string, params: any[] = []): Promise<any> {
  try {
    const [localResult, remoteResult] = await Promise.all([
      localPool.query(query, params),
      alwaysDataPool.query(query, params)
    ]);
    return {
      local: localResult[0],
      remote: remoteResult[0]
    };
  } catch (error) {
    console.error('Error executing query on both DBs:', error);
    throw error;
  }
}

export const getEventById = async (id: number): Promise<any> => {
    const query = `
      SELECT 
        id_event,
        name_Event,
        description_Event,
        event_date,
        hour_event,
        id_festival,
        location
      FROM Events
      WHERE id_event = ?
    `;
    const result = await executeOnBothDbs(query, [id]);
    // Asumimos que el evento existe en la base remota
    return result.remote[0];
  };

  export const updateEvent = async (
    id: number,
    name_Event: string,
    description_Event: string,
    event_date: string, // "YYYY-MM-DD"
    hour_event: string, // "HH:MM:SS"
    id_festival: number,
    location: string
  ): Promise<any> => {
    const query = `
      UPDATE Events
      SET name_Event = ?,
          description_Event = ?,
          event_date = ?,
          hour_event = ?,
          id_festival = ?,
          location = ?
      WHERE id_event = ?
    `;
    return await executeOnBothDbs(query, [name_Event, description_Event, event_date, hour_event, id_festival, location, id]);
  };

// Obtiene los eventos filtrados por el id de la festividad
export const getEventsByFestival = async (festivityId: number): Promise<any> => {
  const query = `
    SELECT
    id_event,
    name_Event,
    description_Event,
    event_date,
    hour_event AS event_time,
    location AS location_name,
    id_festival
    FROM Events
    WHERE id_festival = ?
  `;
  const result = await executeOnBothDbs(query, [festivityId]);
  return result.remote;
};

// Función para crear un nuevo evento
export const createEvent = async (
    name_Event: string,
    description_Event: string,
    event_date: string, // "YYYY-MM-DD"
    hour_event: string, // "HH:MM:SS"
    id_festival: number,
    location: string
  ): Promise<any> => {
    const query = `
      INSERT INTO Events (
        name_Event,
        description_Event,
        event_date,
        hour_event,
        id_festival,
        location
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;
    return await executeOnBothDbs(query, [name_Event, description_Event, event_date, hour_event, id_festival, location]);
  };

  export const deleteEvent = async (id: number): Promise<any> => {
    const query = `DELETE FROM Events WHERE id_event = ?`;
    return await executeOnBothDbs(query, [id]);
  };