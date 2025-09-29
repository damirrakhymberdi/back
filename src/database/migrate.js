const { initDatabase, closeDatabase } = require('./connection');

async function runMigrations() {
    try {
        console.log('🔄 Starting database migrations...');

        // Initialize database connection and create tables
        await initDatabase();

        console.log('✅ All migrations completed successfully!');

        // Create some sample data for testing (optional)
        await createSampleData();

    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    } finally {
        await closeDatabase();
        process.exit(0);
    }
}

async function createSampleData() {
    const { query } = require('./connection');

    try {
        console.log('🔄 Creating sample data...');

        // Check if we already have data
        const result = await query('SELECT COUNT(*) FROM reviews');
        const count = parseInt(result.rows[0].count);

        if (count > 0) {
            console.log('📊 Sample data already exists, skipping...');
            return;
        }

        // Create sample reviews
        const sampleReviews = [
            { user_id: 1, rating: 5, comment: 'Отличный сервис! Очень помог с разработкой.' },
            { user_id: 2, rating: 4, comment: 'Хорошо работает, но иногда медленно отвечает.' },
            { user_id: 3, rating: 5, comment: 'Превосходно! Экономит много времени.' },
            { user_id: 4, rating: 3, comment: 'Неплохо, но есть над чем поработать.' },
            { user_id: 5, rating: 5, comment: '' }
        ];

        for (const review of sampleReviews) {
            await query(
                'INSERT INTO reviews (user_id, rating, comment) VALUES ($1, $2, $3)',
                [review.user_id, review.rating, review.comment]
            );
        }

        console.log('✅ Sample data created successfully!');

    } catch (error) {
        console.warn('⚠️ Failed to create sample data:', error.message);
        // Don't fail the migration for sample data errors
    }
}

// Run migrations if this file is executed directly
if (require.main === module) {
    runMigrations();
}

module.exports = { runMigrations };

