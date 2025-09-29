# 🚀 Инструкция по запуску AI IDE BAS Reviews API

## Быстрый старт

### 1. Установка зависимостей
```bash
npm install
```

### 2. Настройка базы данных

#### PostgreSQL
Убедитесь, что PostgreSQL установлен и запущен. Создайте базу данных:
```sql
CREATE DATABASE aiidebas;
```

#### Переменные окружения
Скопируйте файл конфигурации:
```bash
cp env.example .env
```

Отредактируйте `.env` файл:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=aiidebas
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_super_secret_jwt_key_here
PORT=3000
```

### 3. Запуск миграций
```bash
npm run migrate
```

### 4. Запуск сервера
```bash
# Development режим
npm run dev

# Production режим
npm start
```

## 🧪 Тестирование

### 1. Проверка работоспособности
```bash
curl http://localhost:3000/health
```

### 2. Генерация тестового токена
```bash
node scripts/generate-test-token.js
```

### 3. Тестирование API
Используйте файл `examples/test-api.http` в VS Code с расширением REST Client или в любом HTTP клиенте.

Пример запроса:
```bash
curl -X POST http://localhost:3000/api/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"rating": 5, "comment": "Отличный сервис!"}'
```

## 🔧 Структура проекта

```
├── src/
│   ├── controllers/     # Контроллеры API
│   ├── database/        # Подключение к БД
│   ├── middleware/      # Middleware
│   ├── models/          # Модели данных
│   ├── routes/          # API маршруты
│   ├── validation/      # Валидация
│   └── server.js        # Главный файл
├── scripts/             # Утилиты
├── examples/            # Примеры использования
└── docs/               # Документация
```

## 📊 Мониторинг

Сервер логирует:
- ✅ Все SQL запросы с временем выполнения
- ❌ Ошибки авторизации и валидации
- 📊 Статистику запросов

## 🛠 Разработка

### Добавление новых endpoints
1. Создайте контроллер в `src/controllers/`
2. Добавьте валидацию в `src/validation/`
3. Создайте маршрут в `src/routes/`
4. Обновите документацию

### Работа с базой данных
- Используйте `src/database/connection.js` для запросов
- Создавайте миграции в `src/database/migrate.js`
- Модели в `src/models/`

## 🚨 Устранение проблем

### Ошибка подключения к БД
- Проверьте, что PostgreSQL запущен
- Убедитесь в правильности настроек в `.env`
- Проверьте права доступа к базе данных

### Ошибка авторизации
- Убедитесь, что JWT_SECRET установлен в `.env`
- Проверьте формат токена: `Bearer <token>`
- Убедитесь, что токен не истек

### Ошибки валидации
- Проверьте формат JSON в запросе
- Убедитесь, что rating от 1 до 5
- Комментарий не должен превышать 1000 символов

## 📞 Поддержка

При возникновении проблем:
1. Проверьте логи сервера
2. Убедитесь в корректности конфигурации
3. Проверьте документацию API в `README.md`

