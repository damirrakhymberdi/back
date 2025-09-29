const http = require('http');
const https = require('https');

// Конфигурация
const config = {
    host: 'localhost',
    port: 3000,
    baseUrl: 'http://localhost:3000'
};

// Утилиты для HTTP запросов
function makeRequest(options, data = null) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    const jsonBody = JSON.parse(body);
                    resolve({ status: res.statusCode, headers: res.headers, body: jsonBody });
                } catch (e) {
                    resolve({ status: res.statusCode, headers: res.headers, body: body });
                }
            });
        });

        req.on('error', reject);

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

// Генерация тестового JWT токена
function generateTestToken() {
    const jwt = require('jsonwebtoken');
    const payload = {
        userId: 123,
        email: 'test@example.com',
        iat: Math.floor(Date.now() / 1000)
    };

    return jwt.sign(payload, 'test_secret', { expiresIn: '1h' });
}

// Тесты
async function runTests() {
    console.log('🧪 Начинаем тестирование AI IDE BAS Reviews API...\n');

    const testToken = generateTestToken();
    let passedTests = 0;
    let totalTests = 0;

    // Тест 1: Health Check
    console.log('1️⃣ Тестируем Health Check...');
    totalTests++;
    try {
        const response = await makeRequest({
            hostname: config.host,
            port: config.port,
            path: '/health',
            method: 'GET'
        });

        if (response.status === 200 && response.body.status === 'OK') {
            console.log('✅ Health Check: PASSED');
            passedTests++;
        } else {
            console.log('❌ Health Check: FAILED');
        }
    } catch (error) {
        console.log('❌ Health Check: ERROR -', error.message);
    }

    // Тест 2: Создание отзыва (успешный случай)
    console.log('\n2️⃣ Тестируем создание отзыва...');
    totalTests++;
    try {
        const response = await makeRequest({
            hostname: config.host,
            port: config.port,
            path: '/api/reviews',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${testToken}`
            }
        }, {
            rating: 5,
            comment: 'Отличный сервис! Очень помог с разработкой.'
        });

        if (response.status === 201 && response.body.success === true) {
            console.log('✅ Создание отзыва: PASSED');
            passedTests++;
        } else {
            console.log('❌ Создание отзыва: FAILED -', response.body);
        }
    } catch (error) {
        console.log('❌ Создание отзыва: ERROR -', error.message);
    }

    // Тест 3: Валидация - неверная оценка
    console.log('\n3️⃣ Тестируем валидацию (неверная оценка)...');
    totalTests++;
    try {
        const response = await makeRequest({
            hostname: config.host,
            port: config.port,
            path: '/api/reviews',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${testToken}`
            }
        }, {
            rating: 6,
            comment: 'Тест валидации'
        });

        if (response.status === 400) {
            console.log('✅ Валидация (неверная оценка): PASSED');
            passedTests++;
        } else {
            console.log('❌ Валидация (неверная оценка): FAILED -', response.body);
        }
    } catch (error) {
        console.log('❌ Валидация (неверная оценка): ERROR -', error.message);
    }

    // Тест 4: Валидация - отсутствует оценка
    console.log('\n4️⃣ Тестируем валидацию (отсутствует оценка)...');
    totalTests++;
    try {
        const response = await makeRequest({
            hostname: config.host,
            port: config.port,
            path: '/api/reviews',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${testToken}`
            }
        }, {
            comment: 'Тест без оценки'
        });

        if (response.status === 400) {
            console.log('✅ Валидация (отсутствует оценка): PASSED');
            passedTests++;
        } else {
            console.log('❌ Валидация (отсутствует оценка): FAILED -', response.body);
        }
    } catch (error) {
        console.log('❌ Валидация (отсутствует оценка): ERROR -', error.message);
    }

    // Тест 5: Авторизация - без токена
    console.log('\n5️⃣ Тестируем авторизацию (без токена)...');
    totalTests++;
    try {
        const response = await makeRequest({
            hostname: config.host,
            port: config.port,
            path: '/api/reviews',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }, {
            rating: 5,
            comment: 'Тест без авторизации'
        });

        if (response.status === 401) {
            console.log('✅ Авторизация (без токена): PASSED');
            passedTests++;
        } else {
            console.log('❌ Авторизация (без токена): FAILED -', response.body);
        }
    } catch (error) {
        console.log('❌ Авторизация (без токена): ERROR -', error.message);
    }

    // Тест 6: Получение отзывов пользователя
    console.log('\n6️⃣ Тестируем получение отзывов пользователя...');
    totalTests++;
    try {
        const response = await makeRequest({
            hostname: config.host,
            port: config.port,
            path: '/api/reviews/my',
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${testToken}`
            }
        });

        if (response.status === 200 && response.body.success === true) {
            console.log('✅ Получение отзывов пользователя: PASSED');
            passedTests++;
        } else {
            console.log('❌ Получение отзывов пользователя: FAILED -', response.body);
        }
    } catch (error) {
        console.log('❌ Получение отзывов пользователя: ERROR -', error.message);
    }

    // Тест 7: Статистика отзывов
    console.log('\n7️⃣ Тестируем получение статистики...');
    totalTests++;
    try {
        const response = await makeRequest({
            hostname: config.host,
            port: config.port,
            path: '/api/reviews/stats',
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${testToken}`
            }
        });

        if (response.status === 200 && response.body.success === true) {
            console.log('✅ Статистика отзывов: PASSED');
            passedTests++;
        } else {
            console.log('❌ Статистика отзывов: FAILED -', response.body);
        }
    } catch (error) {
        console.log('❌ Статистика отзывов: ERROR -', error.message);
    }

    // Результаты
    console.log('\n📊 РЕЗУЛЬТАТЫ ТЕСТИРОВАНИЯ:');
    console.log(`✅ Пройдено: ${passedTests}/${totalTests}`);
    console.log(`❌ Провалено: ${totalTests - passedTests}/${totalTests}`);

    if (passedTests === totalTests) {
        console.log('\n🎉 ВСЕ ТЕСТЫ ПРОЙДЕНЫ! API работает корректно!');
    } else {
        console.log('\n⚠️ Некоторые тесты провалились. Проверьте логи выше.');
    }
}

// Проверяем, запущен ли сервер
async function checkServer() {
    try {
        const response = await makeRequest({
            hostname: config.host,
            port: config.port,
            path: '/health',
            method: 'GET'
        });
        return response.status === 200;
    } catch (error) {
        return false;
    }
}

// Главная функция
async function main() {
    console.log('🔍 Проверяем, запущен ли сервер...');

    const serverRunning = await checkServer();
    if (!serverRunning) {
        console.log('❌ Сервер не запущен!');
        console.log('💡 Запустите сервер командой: npm run dev');
        console.log('💡 Или в другом терминале: node src/server.js');
        return;
    }

    console.log('✅ Сервер запущен, начинаем тестирование...\n');
    await runTests();
}

// Запуск тестов
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { runTests, checkServer };
