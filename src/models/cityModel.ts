import { localPool, alwaysDataPool } from '../config/db';

interface DbOperationResult {
  local: any;
  remote: any;
}

// Helper para ejecutar la consulta en ambas bases de datos
async function executeOnBothDbs(
  query: string,
  params: any[] = [],
): Promise<DbOperationResult> {
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
    console.error('❌ Error executing on both databases:', error);
    throw error;
  }
}

// Función que obtiene las ciudades (sin duplicados) filtradas por provincia
export const getCitiesByProvince = async (province: string): Promise<DbOperationResult> => {
  try {
    return await executeOnBothDbs(
      'SELECT DISTINCT city FROM Locations WHERE province = ?',
      [province]
    );
  } catch (error) {
    console.error('❌ Error in getCitiesByProvince:', error);
    throw error;
  }
};
