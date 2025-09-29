const http = require('http');

console.log('🧪 Быстрый тест AI IDE BAS Reviews API...\n');

// Тест 1: Health Check
console.log('1️⃣ Тестируем Health Check...');
const healthRequest = http.get('http://localhost:3000/health', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      if (response.status === 'OK') {
        console.log('✅ Health Check: PASSED');
        console.log('   Ответ:', response);
      } else {
        console.log('❌ Health Check: FAILED');
      }
    } catch (e) {
      console.log('❌ Health Check: ERROR -', e.message);
    }
  });
});

healthRequest.on('error', (err) => {
  console.log('❌ Health Check: ERROR -', err.message);
  console.log('💡 Убедитесь что сервер запущен: node test-server.js');
});

// Тест 2: Создание отзыва
setTimeout(() => {
  console.log('\n2️⃣ Тестируем создание отзыва...');
  
  const postData = JSON.stringify({
    rating: 5,
    comment: 'Отличный сервис! Очень помог с разработкой.'
  });
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/reviews',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyMywiZW1haWwiOiJ0ZXN0MTIzQGV4YW1wbGUuY29tIiwiaWF0IjoxNzU5MTI3NjgxLCJleHAiOjE3NTkyMTQwODF9.kfhI8XLHFQkEJAjpa77-gMAKmVNvMPXYU5GyanVmmrk'
    }
  };
  
  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        if (res.statusCode === 201 && response.success === true) {
          console.log('✅ Создание отзыва: PASSED');
          console.log('   Ответ:', response.message);
        } else {
          console.log('❌ Создание отзыва: FAILED');
          console.log('   Статус:', res.statusCode);
          console.log('   Ответ:', response);
        }
      } catch (e) {
        console.log('❌ Создание отзыва: ERROR -', e.message);
        console.log('   Ответ:', data);
      }
    });
  });
  
  req.on('error', (err) => {
    console.log('❌ Создание отзыва: ERROR -', err.message);
  });
  
  req.write(postData);
  req.end();
}, 1000);

// Тест 3: Валидация
setTimeout(() => {
  console.log('\n3️⃣ Тестируем валидацию (неверная оценка)...');
  
  const postData = JSON.stringify({
    rating: 6,
    comment: 'Тест валидации'
  });
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/reviews',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyMywiZW1haWwiOiJ0ZXN0MTIzQGV4YW1wbGUuY29tIiwiaWF0IjoxNzU5MTI3NjgxLCJleHAiOjE3NTkyMTQwODF9.kfhI8XLHFQkEJAjpa77-gMAKmVNvMPXYU5GyanVmmrk'
    }
  };
  
  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      if (res.statusCode === 400) {
        console.log('✅ Валидация (неверная оценка): PASSED');
        console.log('   Статус:', res.statusCode);
      } else {
        console.log('❌ Валидация (неверная оценка): FAILED');
        console.log('   Статус:', res.statusCode);
        console.log('   Ответ:', data);
      }
    });
  });
  
  req.on('error', (err) => {
    console.log('❌ Валидация: ERROR -', err.message);
  });
  
  req.write(postData);
  req.end();
}, 2000);

// Тест 4: Авторизация
setTimeout(() => {
  console.log('\n4️⃣ Тестируем авторизацию (без токена)...');
  
  const postData = JSON.stringify({
    rating: 5,
    comment: 'Тест без авторизации'
  });
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/reviews',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      if (res.statusCode === 401) {
        console.log('✅ Авторизация (без токена): PASSED');
        console.log('   Статус:', res.statusCode);
      } else {
        console.log('❌ Авторизация (без токена): FAILED');
        console.log('   Статус:', res.statusCode);
        console.log('   Ответ:', data);
      }
    });
  });
  
  req.on('error', (err) => {
    console.log('❌ Авторизация: ERROR -', err.message);
  });
  
  req.write(postData);
  req.end();
}, 3000);

// Тест 5: Получение отзывов
setTimeout(() => {
  console.log('\n5️⃣ Тестируем получение отзывов пользователя...');
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/reviews/my',
    method: 'GET',
    headers: {
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyMywiZW1haWwiOiJ0ZXN0MTIzQGV4YW1wbGUuY29tIiwiaWF0IjoxNzU5MTI3NjgxLCJleHAiOjE3NTkyMTQwODF9.kfhI8XLHFQkEJAjpa77-gMAKmVNvMPXYU5GyanVmmrk'
    }
  };
  
  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        if (res.statusCode === 200 && response.success === true) {
          console.log('✅ Получение отзывов: PASSED');
          console.log('   Количество отзывов:', response.data.reviews.length);
        } else {
          console.log('❌ Получение отзывов: FAILED');
          console.log('   Статус:', res.statusCode);
          console.log('   Ответ:', response);
        }
      } catch (e) {
        console.log('❌ Получение отзывов: ERROR -', e.message);
        console.log('   Ответ:', data);
      }
    });
  });
  
  req.on('error', (err) => {
    console.log('❌ Получение отзывов: ERROR -', err.message);
  });
  
  req.end();
}, 4000);

// Тест 6: Статистика
setTimeout(() => {
  console.log('\n6️⃣ Тестируем получение статистики...');
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/reviews/stats',
    method: 'GET',
    headers: {
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyMywiZW1haWwiOiJ0ZXN0MTIzQGV4YW1wbGUuY29tIiwiaWF0IjoxNzU5MTI3NjgxLCJleHAiOjE3NTkyMTQwODF9.kfhI8XLHFQkEJAjpa77-gMAKmVNvMPXYU5GyanVmmrk'
    }
  };
  
  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        if (res.statusCode === 200 && response.success === true) {
          console.log('✅ Статистика: PASSED');
          console.log('   Всего отзывов:', response.data.statistics.totalReviews);
          console.log('   Средняя оценка:', response.data.statistics.averageRating);
        } else {
          console.log('❌ Статистика: FAILED');
          console.log('   Статус:', res.statusCode);
          console.log('   Ответ:', response);
        }
      } catch (e) {
        console.log('❌ Статистика: ERROR -', e.message);
        console.log('   Ответ:', data);
      }
    });
  });
  
  req.on('error', (err) => {
    console.log('❌ Статистика: ERROR -', err.message);
  });
  
  req.end();
}, 5000);

// Завершение
setTimeout(() => {
  console.log('\n📊 Тестирование завершено!');
  console.log('💡 Если тесты провалились, убедитесь что сервер запущен:');
  console.log('   node test-server.js');
  process.exit(0);
}, 6000);
