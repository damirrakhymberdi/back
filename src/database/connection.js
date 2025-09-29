const { Pool } = require('pg');

let pool;

const initDatabase = async () => {
    try {
        pool = new Pool({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 5432,
            database: process.env.DB_NAME || 'aiidebas',
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || '',
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
        });

        // Test connection
        const client = await pool.connect();
        console.log('📊 Database connected successfully');
        client.release();

        // Initialize tables if they don't exist
        await createTables();

        return pool;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        throw error;
    }
};

const createTables = async () => {
    try {
        // Create reviews table
        const createReviewsTable = `
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

        // Create index for better performance
        const createIndex = `
      CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
      CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at);
    `;

        await pool.query(createReviewsTable);
        await pool.query(createIndex);

        console.log('✅ Database tables created/verified');
    } catch (error) {
        console.error('❌ Failed to create tables:', error.message);
        throw error;
    }
};

const getPool = () => {
    if (!pool) {
        throw new Error('Database not initialized. Call initDatabase() first.');
    }
    return pool;
};

const query = async (text, params) => {
    const pool = getPool();
    const start = Date.now();
    try {
        const res = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log('📊 Query executed', { text, duration, rows: res.rowCount });
        return res;
    } catch (error) {
        console.error('❌ Query error:', { text, error: error.message });
        throw error;
    }
};

const closeDatabase = async () => {
    if (pool) {
        await pool.end();
        console.log('📊 Database connection closed');
    }
};

// Graceful shutdown
process.on('SIGINT', closeDatabase);
process.on('SIGTERM', closeDatabase);

module.exports = {
    initDatabase,
    getPool,
    query,
    closeDatabase
};

