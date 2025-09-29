# Простой тест API через PowerShell
Write-Host "🧪 Тестируем AI IDE BAS Reviews API..." -ForegroundColor Green

# Генерируем тестовый токен
$testToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyMywiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiaWF0IjoxNzM3MDQ4MDAwfQ.example"

# Функция для HTTP запросов
function Test-API {
    param(
        [string]$Method,
        [string]$Url,
        [string]$Body = $null,
        [hashtable]$Headers = @{}
    )
    
    try {
        $response = Invoke-RestMethod -Uri $Url -Method $Method -Body $Body -Headers $Headers -ContentType "application/json"
        return @{ Success = $true; Data = $response }
    }
    catch {
        return @{ Success = $false; Error = $_.Exception.Message; StatusCode = $_.Exception.Response.StatusCode.value__ }
    }
}

# Тест 1: Health Check
Write-Host "`n1️⃣ Тестируем Health Check..." -ForegroundColor Yellow
$healthTest = Test-API -Method "GET" -Url "http://localhost:3000/health"
if ($healthTest.Success -and $healthTest.Data.status -eq "OK") {
    Write-Host "✅ Health Check: PASSED" -ForegroundColor Green
} else {
    Write-Host "❌ Health Check: FAILED" -ForegroundColor Red
    Write-Host "Ошибка: $($healthTest.Error)" -ForegroundColor Red
}

# Тест 2: Создание отзыва
Write-Host "`n2️⃣ Тестируем создание отзыва..." -ForegroundColor Yellow
$reviewData = @{
    rating = 5
    comment = "Отличный сервис! Очень помог с разработкой."
} | ConvertTo-Json

$reviewTest = Test-API -Method "POST" -Url "http://localhost:3000/api/reviews" -Body $reviewData -Headers @{ "Authorization" = "Bearer $testToken" }
if ($reviewTest.Success -and $reviewTest.Data.success -eq $true) {
    Write-Host "✅ Создание отзыва: PASSED" -ForegroundColor Green
} else {
    Write-Host "❌ Создание отзыва: FAILED" -ForegroundColor Red
    Write-Host "Ошибка: $($reviewTest.Error)" -ForegroundColor Red
}

# Тест 3: Валидация (неверная оценка)
Write-Host "`n3️⃣ Тестируем валидацию (неверная оценка)..." -ForegroundColor Yellow
$invalidData = @{
    rating = 6
    comment = "Тест валидации"
} | ConvertTo-Json

$validationTest = Test-API -Method "POST" -Url "http://localhost:3000/api/reviews" -Body $invalidData -Headers @{ "Authorization" = "Bearer $testToken" }
if (-not $validationTest.Success -and $validationTest.StatusCode -eq 400) {
    Write-Host "✅ Валидация (неверная оценка): PASSED" -ForegroundColor Green
} else {
    Write-Host "❌ Валидация (неверная оценка): FAILED" -ForegroundColor Red
    Write-Host "Ошибка: $($validationTest.Error)" -ForegroundColor Red
}

# Тест 4: Авторизация (без токена)
Write-Host "`n4️⃣ Тестируем авторизацию (без токена)..." -ForegroundColor Yellow
$authTest = Test-API -Method "POST" -Url "http://localhost:3000/api/reviews" -Body $reviewData
if (-not $authTest.Success -and $authTest.StatusCode -eq 401) {
    Write-Host "✅ Авторизация (без токена): PASSED" -ForegroundColor Green
} else {
    Write-Host "❌ Авторизация (без токена): FAILED" -ForegroundColor Red
    Write-Host "Ошибка: $($authTest.Error)" -ForegroundColor Red
}

# Тест 5: Получение отзывов пользователя
Write-Host "`n5️⃣ Тестируем получение отзывов пользователя..." -ForegroundColor Yellow
$myReviewsTest = Test-API -Method "GET" -Url "http://localhost:3000/api/reviews/my" -Headers @{ "Authorization" = "Bearer $testToken" }
if ($myReviewsTest.Success -and $myReviewsTest.Data.success -eq $true) {
    Write-Host "✅ Получение отзывов пользователя: PASSED" -ForegroundColor Green
} else {
    Write-Host "❌ Получение отзывов пользователя: FAILED" -ForegroundColor Red
    Write-Host "Ошибка: $($myReviewsTest.Error)" -ForegroundColor Red
}

# Тест 6: Статистика отзывов
Write-Host "`n6️⃣ Тестируем получение статистики..." -ForegroundColor Yellow
$statsTest = Test-API -Method "GET" -Url "http://localhost:3000/api/reviews/stats" -Headers @{ "Authorization" = "Bearer $testToken" }
if ($statsTest.Success -and $statsTest.Data.success -eq $true) {
    Write-Host "✅ Статистика отзывов: PASSED" -ForegroundColor Green
} else {
    Write-Host "❌ Статистика отзывов: FAILED" -ForegroundColor Red
    Write-Host "Ошибка: $($statsTest.Error)" -ForegroundColor Red
}

Write-Host "`n📊 Тестирование завершено!" -ForegroundColor Cyan
Write-Host "💡 Если тесты провалились, убедитесь что сервер запущен:" -ForegroundColor Yellow
Write-Host "   node test-server.js" -ForegroundColor White
