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

// Get all festival types from both databases
export const getTypeFestival = async (): Promise<DbOperationResult> => {
    try {
        return await executeOnBothDbs('SELECT * FROM FestivalTypes');
    } catch (error) {
        console.error('❌ Error in getTypeFestival:', error);
        throw error;
    }
};

// Create festival type in both databases
export const createTypeFestival = async (
    name: string, 
    description: string
): Promise<DbOperationResult> => {
    try {
        return await executeOnBothDbs(
            'INSERT INTO FestivalTypes (name_FType, description_FType) VALUES (?, ?)',
            [name, description]
        );
    } catch (error) {
        console.error('❌ Error in createTypeFestival:', error);
        throw error;
    }
};

// Helper function to verify data consistency between databases
export const verifyConsistency = async (): Promise<boolean> => {
    try {
        const { local, remote } = await getTypeFestival();
        
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