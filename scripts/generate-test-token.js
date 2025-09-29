const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Скрипт для генерации тестового JWT токена
 * Используйте этот токен для тестирования API
 */

const generateTestToken = (userId = 123) => {
    const payload = {
        userId: userId,
        email: `test${userId}@example.com`,
        iat: Math.floor(Date.now() / 1000)
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'test_secret', {
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    });

    return token;
};

if (require.main === module) {
    const userId = process.argv[2] || 123;
    const token = generateTestToken(userId);

    console.log('🔑 Test JWT Token generated:');
    console.log('');
    console.log(token);
    console.log('');
    console.log('📋 Usage in API requests:');
    console.log(`Authorization: Bearer ${token}`);
    console.log('');
    console.log('💡 You can also generate token for specific user:');
    console.log('node scripts/generate-test-token.js 456');
}

module.exports = { generateTestToken };

