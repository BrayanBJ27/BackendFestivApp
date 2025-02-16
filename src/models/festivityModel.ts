import { localPool, alwaysDataPool } from '../config/db';
import { Pool } from 'mysql2/promise';

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