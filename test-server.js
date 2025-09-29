const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');

// Используем SQLite для тестирования
const { initDatabase, query } = require('./src/database/sqlite-connection');

const app = express();
const PORT = 3000;

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Простая авторизация для тестирования
const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: 'Authorization header is required'
            });
        }

        const token = authHeader.startsWith('Bearer ')
            ? authHeader.slice(7)
            : authHeader;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token is required'
            });
        }

        // Простая проверка токена для тестирования
        const decoded = jwt.verify(token, 'test_secret');
        req.user = { id: decoded.userId };
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
};

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'AI IDE BAS Reviews API (Test Mode)'
    });
});

// Reviews endpoints
app.post('/api/reviews', authMiddleware, async (req, res) => {
    try {
        const { rating, comment } = req.body;

        // Простая валидация
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5'
            });
        }

        // Создаем отзыв
        const result = await query(
            'INSERT INTO reviews (user_id, rating, comment) VALUES (?, ?, ?)',
            [req.user.id, rating, comment || null]
        );

        res.status(201).json({
            success: true,
            message: 'Спасибо за отзыв!',
            data: {
                review: {
                    id: result.lastID,
                    userId: req.user.id,
                    rating: rating,
                    comment: comment,
                    createdAt: new Date().toISOString()
                }
            }
        });
    } catch (error) {
        console.error('Create review error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create review'
        });
    }
});

app.get('/api/reviews/my', authMiddleware, async (req, res) => {
    try {
        const result = await query(
            'SELECT * FROM reviews WHERE user_id = ? ORDER BY created_at DESC',
            [req.user.id]
        );

        res.json({
            success: true,
            data: {
                reviews: result.rows,
                pagination: {
                    page: 1,
                    limit: 10,
                    total: result.rows.length
                }
            }
        });
    } catch (error) {
        console.error('Get reviews error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch reviews'
        });
    }
});

app.get('/api/reviews/stats', authMiddleware, async (req, res) => {
    try {
        const statsResult = await query(`
      SELECT 
        COUNT(*) as total_reviews,
        AVG(rating) as average_rating,
        COUNT(CASE WHEN comment IS NOT NULL AND comment != '' THEN 1 END) as reviews_with_comments
      FROM reviews
    `);

        const distributionResult = await query(`
      SELECT 
        rating,
        COUNT(*) as count
      FROM reviews 
      GROUP BY rating 
      ORDER BY rating
    `);

        const stats = statsResult.rows[0];

        res.json({
            success: true,
            data: {
                statistics: {
                    totalReviews: parseInt(stats.total_reviews),
                    averageRating: parseFloat(stats.average_rating || 0).toFixed(2),
                    reviewsWithComments: parseInt(stats.reviews_with_comments)
                },
                ratingDistribution: distributionResult.rows.map(item => ({
                    rating: item.rating,
                    count: parseInt(item.count)
                }))
            }
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch statistics'
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Initialize database and start server
async function startServer() {
    try {
        await initDatabase();
        console.log('✅ Test database initialized');

        app.listen(PORT, () => {
            console.log(`🚀 Test server running on port ${PORT}`);
            console.log(`📋 Health check: http://localhost:${PORT}/health`);
            console.log(`📝 Reviews API: http://localhost:${PORT}/api/reviews`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

startServer();

module.exports = app;
