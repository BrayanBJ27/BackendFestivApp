import pool from '../config/db';

export const getFestivals = async (): Promise<any[]> => {
    const [rows]: [any[], any] = await pool.query('SELECT * FROM Festivals');
    return rows; // Ahora está correctamente tipado como 'any[]'
};

export const getFestivalById = async (id: number): Promise<any> => {
    const [rows]: [any[], any] = await pool.query('SELECT * FROM Festivals WHERE id_festival = ?', [id]);
    return rows[0];
};

export const createFestival = async (festivalData: any): Promise<number> => {
    const { name_Festival, description_Festival, start_date, end_date, id_festival_type, id_location, image } = festivalData;
    const [result]: any = await pool.query(
        'INSERT INTO Festivals (name_Festival, description_Festival, start_date, end_date, id_festival_type, id_location, image) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [name_Festival, description_Festival, start_date, end_date, id_festival_type, id_location, image]
    );
    return result.insertId;
};
