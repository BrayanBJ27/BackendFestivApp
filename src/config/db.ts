import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'brayanbj',
    database: 'FestivApp'
});

export default pool;
