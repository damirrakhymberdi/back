# 🧪 Ручное тестирование AI IDE BAS Reviews API

## Как протестировать API самостоятельно:

### 1. Запуск сервера
```bash
# В первом терминале
node test-server.js
```

### 2. Тестирование через браузер
Откройте браузер и перейдите по адресам:

- **Health Check**: http://localhost:3000/health
- **API Docs**: http://localhost:3000/api/reviews (должна показать ошибку 404 - это нормально)

### 3. Тестирование через PowerShell

#### Генерация тестового токена:
```bash
node scripts/generate-test-token.js
```

#### Тест 1: Health Check
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/health" -Method GET
```

#### Тест 2: Создание отзыва
```powershell
$headers = @{ "Authorization" = "Bearer YOUR_TOKEN_HERE" }
$body = @{ rating = 5; comment = "Отличный сервис!" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/reviews" -Method POST -Body $body -Headers $headers -ContentType "application/json"
```

#### Тест 3: Валидация (должна вернуть ошибку 400)
```powershell
$headers = @{ "Authorization" = "Bearer YOUR_TOKEN_HERE" }
$body = @{ rating = 6; comment = "Тест валидации" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/reviews" -Method POST -Body $body -Headers $headers -ContentType "application/json"
```

#### Тест 4: Авторизация (должна вернуть ошибку 401)
```powershell
$body = @{ rating = 5; comment = "Тест без авторизации" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/reviews" -Method POST -Body $body -ContentType "application/json"
```

#### Тест 5: Получение отзывов
```powershell
$headers = @{ "Authorization" = "Bearer YOUR_TOKEN_HERE" }
Invoke-RestMethod -Uri "http://localhost:3000/api/reviews/my" -Method GET -Headers $headers
```

#### Тест 6: Статистика
```powershell
$headers = @{ "Authorization" = "Bearer YOUR_TOKEN_HERE" }
Invoke-RestMethod -Uri "http://localhost:3000/api/reviews/stats" -Method GET -Headers $headers
```

### 4. Тестирование через curl (если установлен)

#### Health Check:
```bash
curl http://localhost:3000/health
```

#### Создание отзыва:
```bash
curl -X POST http://localhost:3000/api/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"rating": 5, "comment": "Отличный сервис!"}'
```

### 5. Ожидаемые результаты

#### ✅ Успешные тесты:
- **Health Check**: `{"status":"OK","timestamp":"...","service":"AI IDE BAS Reviews API (Test Mode)"}`
- **Создание отзыва**: `{"success":true,"message":"Спасибо за отзыв!","data":{"review":{...}}}`
- **Получение отзывов**: `{"success":true,"data":{"reviews":[...],"pagination":{...}}}`
- **Статистика**: `{"success":true,"data":{"statistics":{...},"ratingDistribution":[...]}}`

#### ❌ Ошибки (это нормально):
- **Валидация**: `400 Bad Request` с сообщением об ошибке
- **Авторизация**: `401 Unauthorized` с сообщением "Authorization header is required"

### 6. Что проверить

1. **Сервер запускается** без ошибок
2. **Health Check** возвращает статус OK
3. **Создание отзыва** работает с валидными данными
4. **Валидация** отклоняет неверные данные (rating > 5)
5. **Авторизация** требует токен
6. **Получение отзывов** возвращает список
7. **Статистика** показывает данные

### 7. Возможные проблемы

- **Порт занят**: Измените порт в test-server.js на 3001
- **Зависимости**: Запустите `npm install`
- **Токен недействителен**: Сгенерируйте новый через `node scripts/generate-test-token.js`

## 🎯 Результат тестирования

Если все тесты проходят - API работает корректно и готов к использованию!
