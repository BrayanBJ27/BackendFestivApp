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

// Get all province from both databases
export const getProvince = async (): Promise<DbOperationResult> => {
    try {
        return await executeOnBothDbs('SELECT DISTINCT province FROM Locations');
    } catch (error) {
        console.error('❌ Error in getProvince:', error);
        throw error;
    }
};

// Helper function to verify data consistency between databases
export const verifyConsistency = async (): Promise<boolean> => {
    try {
        const { local, remote } = await getProvince();
        
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