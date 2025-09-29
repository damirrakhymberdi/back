# 🚀 AI IDE BAS Reviews API

> REST API для системы отзывов AI IDE BAS, позволяющий пользователям оставлять оценки и комментарии к ответам ИИ-помощника.

[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-12+-blue.svg)](https://postgresql.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.18+-red.svg)](https://expressjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 Возможности

- ✅ Создание отзывов с оценкой (1-5 звезд) и комментарием
- ✅ Авторизация по JWT токену
- ✅ Валидация входных данных
- ✅ Защита от спама (rate limiting)
- ✅ Получение статистики отзывов
- ✅ Получение отзывов пользователя

## ⚡ Быстрый старт

```bash
# 1. Клонируйте репозиторий
git clone https://github.com/your-username/aiidebas-reviews-api.git
cd aiidebas-reviews-api

# 2. Установите зависимости
npm install

# 3. Настройте переменные окружения
cp env.example .env
# Отредактируйте .env файл

# 4. Запустите миграции
npm run migrate

# 5. Запустите сервер
npm run dev
```

## 📋 Требования

- Node.js 16+
- PostgreSQL 12+
- npm или yarn

## 🛠 Установка

1. **Клонируйте репозиторий и установите зависимости:**
```bash
npm install
```

2. **Настройте переменные окружения:**
```bash
cp env.example .env
```

Отредактируйте файл `.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=aiidebas
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_super_secret_jwt_key_here
PORT=3000
```

3. **Создайте базу данных PostgreSQL:**
```sql
CREATE DATABASE aiidebas;
```

4. **Запустите миграции:**
```bash
npm run migrate
```

5. **Запустите сервер:**
```bash
# Development
npm run dev

# Production
npm start
```

## 📚 API Документация

### Базовый URL
```
http://localhost:3000/api
```

### Авторизация
Все запросы требуют заголовок авторизации:
```
Authorization: Bearer <your_jwt_token>
```

### Endpoints

#### 1. Создать отзыв
```http
POST /reviews
Content-Type: application/json
Authorization: Bearer <token>

{
  "rating": 5,
  "comment": "Отличный сервис!"
}
```

**Ответ:**
```json
{
  "success": true,
  "message": "Спасибо за отзыв!",
  "data": {
    "review": {
      "id": 1,
      "userId": 123,
      "rating": 5,
      "comment": "Отличный сервис!",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

#### 2. Получить мои отзывы
```http
GET /reviews/my?page=1&limit=10
Authorization: Bearer <token>
```

#### 3. Получить статистику отзывов
```http
GET /reviews/stats
Authorization: Bearer <token>
```

**Ответ:**
```json
{
  "success": true,
  "data": {
    "statistics": {
      "totalReviews": 150,
      "averageRating": "4.3",
      "reviewsWithComments": 120
    },
    "ratingDistribution": [
      { "rating": 1, "count": 5 },
      { "rating": 2, "count": 10 },
      { "rating": 3, "count": 25 },
      { "rating": 4, "count": 50 },
      { "rating": 5, "count": 60 }
    ]
  }
}
```

#### 4. Получить отзыв по ID
```http
GET /reviews/:id
Authorization: Bearer <token>
```

### Коды ошибок

| Код | Описание |
|-----|----------|
| 400 | Ошибка валидации данных |
| 401 | Не авторизован или неверный токен |
| 404 | Отзыв не найден |
| 429 | Превышен лимит запросов |
| 500 | Внутренняя ошибка сервера |

## 🗄 Структура базы данных

### Таблица `reviews`
```sql
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## 🔧 Разработка

### Структура проекта
```
src/
├── controllers/     # Контроллеры для обработки запросов
├── database/        # Подключение к БД и миграции
├── middleware/      # Middleware (авторизация и т.д.)
├── models/          # Модели данных
├── routes/          # API маршруты
├── validation/      # Валидация входных данных
└── server.js        # Главный файл сервера
```

### Скрипты
```bash
npm start      # Запуск в production
npm run dev    # Запуск в development режиме
npm run migrate # Запуск миграций БД
```

### Health Check
```http
GET /health
```

## 🛡 Безопасность

- JWT авторизация
- Rate limiting (100 запросов в 15 минут)
- Валидация всех входных данных
- Helmet для безопасности заголовков
- CORS настройки

## 📊 Мониторинг

Сервер логирует:
- Все SQL запросы с временем выполнения
- Ошибки авторизации
- Ошибки валидации
- Общие ошибки сервера

## 🤝 Интеграция с фронтендом

После успешной отправки отзыва (статус 201), фронтенд должен:
1. Скрыть блок оценки
2. Показать сообщение "Спасибо за отзыв!"

Пример интеграции:
```javascript
const submitReview = async (rating, comment) => {
  try {
    const response = await fetch('/api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ rating, comment })
    });
    
    if (response.ok) {
      // Скрыть блок оценки
      document.getElementById('review-block').style.display = 'none';
      // Показать сообщение об успехе
      showSuccessMessage('Спасибо за отзыв!');
    }
  } catch (error) {
    console.error('Error submitting review:', error);
  }
};
```

