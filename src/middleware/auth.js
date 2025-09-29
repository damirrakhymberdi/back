const jwt = require('jsonwebtoken');
const { query } = require('../database/connection');

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

        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Optional: Verify user still exists in database
        // This is useful if you want to invalidate tokens for deleted users
        try {
            const userResult = await query(
                'SELECT id, email FROM users WHERE id = $1 AND is_active = true',
                [decoded.userId]
            );

            if (userResult.rows.length === 0) {
                return res.status(401).json({
                    success: false,
                    message: 'User not found or inactive'
                });
            }

            req.user = userResult.rows[0];
        } catch (dbError) {
            // If users table doesn't exist or query fails, 
            // we'll still allow the request but log the error
            console.warn('⚠️ Could not verify user in database:', dbError.message);
            req.user = { id: decoded.userId };
        }

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token has expired'
            });
        }

        console.error('Auth middleware error:', error);
        return res.status(500).json({
            success: false,
            message: 'Authentication error'
        });
    }
};

module.exports = authMiddleware;

