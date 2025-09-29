const sqlite3 = require('sqlite3').verbose();
const path = require('path');

let db;

const initDatabase = async () => {
    try {
        // Создаем базу данных в памяти для тестирования
        db = new sqlite3.Database(':memory:');

        console.log('📊 SQLite database connected successfully');

        // Создаем таблицы
        await createTables();

        return db;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        throw error;
    }
};

const createTables = async () => {
    return new Promise((resolve, reject) => {
        const createReviewsTable = `
      CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `;

        db.run(createReviewsTable, (err) => {
            if (err) {
                console.error('❌ Failed to create tables:', err.message);
                reject(err);
            } else {
                console.log('✅ Database tables created/verified');
                resolve();
            }
        });
    });
};

const query = async (text, params = []) => {
    return new Promise((resolve, reject) => {
        const start = Date.now();

        if (text.trim().toUpperCase().startsWith('SELECT')) {
            db.all(text, params, (err, rows) => {
                const duration = Date.now() - start;
                if (err) {
                    console.error('❌ Query error:', { text, error: err.message });
                    reject(err);
                } else {
                    console.log('📊 Query executed', { text, duration, rows: rows.length });
                    resolve({ rows, rowCount: rows.length });
                }
            });
        } else {
            db.run(text, params, function (err) {
                const duration = Date.now() - start;
                if (err) {
                    console.error('❌ Query error:', { text, error: err.message });
                    reject(err);
                } else {
                    console.log('📊 Query executed', { text, duration, rows: this.changes });
                    resolve({ rows: [], rowCount: this.changes, lastID: this.lastID });
                }
            });
        }
    });
};

const closeDatabase = async () => {
    if (db) {
        return new Promise((resolve) => {
            db.close((err) => {
                if (err) {
                    console.error('❌ Error closing database:', err.message);
                } else {
                    console.log('📊 Database connection closed');
                }
                resolve();
            });
        });
    }
};

// Graceful shutdown
process.on('SIGINT', closeDatabase);
process.on('SIGTERM', closeDatabase);

module.exports = {
    initDatabase,
    query,
    closeDatabase
};
