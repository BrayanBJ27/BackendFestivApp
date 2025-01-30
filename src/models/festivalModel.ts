import pool from '../config/db';

export const getFestivals = async (): Promise<any[]> => {
    const [rows]: [any[], any] = await pool.query('SELECT * FROM Festivals');
    return rows;
};

export const createFestival = async (festivalData: any): Promise<number> => {
    const { name_Festival, description_Festival, start_date, end_date, id_festival_type, id_location, image } = festivalData;
    const [result]: any = await pool.query(
        'INSERT INTO Festivals (name_Festival, description_Festival, start_date, end_date, id_festival_type, id_location, image) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [name_Festival, description_Festival, start_date, end_date, id_festival_type, id_location, image]
    );
    return result.insertId;
};
