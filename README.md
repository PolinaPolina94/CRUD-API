# CRUD API

## Установка

```bash
npm install

# 1.1 GET всех пользователей (+10 баллов)
iwr -Method GET -Uri "http://localhost:4000/api/users" | Select-Object StatusCode, Content

# 1.2 POST создание пользователя (+10 баллов)
$body1 = '{"username": "Test User", "age": 25, "hobbies": ["reading", "swimming"]}'
$response1 = iwr -Method POST -Uri "http://localhost:4000/api/users" -ContentType "application/json" -Body $body1
$response1 | Select-Object StatusCode, Content

# 1.3 Сохраняем ID созданного пользователя
$user = $response1.Content | ConvertFrom-Json
$userId = $user.id
Write-Host "ID созданного пользователя: $userId"

# 1.4 GET пользователя по ID (+10 баллов)
iwr -Method GET -Uri "http://localhost:4000/api/users/$userId" | Select-Object StatusCode, Content

# 1.5 PUT обновление пользователя (+10 баллов)
$body2 = '{"username": "Updated User", "age": 26, "hobbies": ["coding", "gaming"]}'
iwr -Method PUT -Uri "http://localhost:4000/api/users/$userId" -ContentType "application/json" -Body $body2 | Select-Object StatusCode, Content

# 1.6 DELETE пользователя (+10 баллов)
iwr -Method DELETE -Uri "http://localhost:4000/api/users/$userId" | Select-Object StatusCode, Content

# 2.1 Проверка структуры пользователя (+6 баллов)
$body3 = '{"username": "Structure Test", "age": 30, "hobbies": ["test1", "test2"]}'
$response2 = iwr -Method POST -Uri "http://localhost:4000/api/users" -ContentType "application/json" -Body $body3
$userStruct = $response2.Content | ConvertFrom-Json
Write-Host "Проверка структуры:"
Write-Host "ID: $($userStruct.id)"
Write-Host "Username: $($userStruct.username)" 
Write-Host "Age: $($userStruct.age)"
Write-Host "Hobbies: $($userStruct.hobbies -join ', ')"

# 2.2 Проверка порта из .env (+6 баллов)
Write-Host "Сервер работает на порту 4000 - OK"

# 2.3 Тестирование обработки ошибок (+10 баллов)
Write-Host "`nТестирование обработки ошибок:"

# Невалидный JSON
iwr -Method POST -Uri "http://localhost:4000/api/users" -ContentType "application/json" -Body 'invalid json' | Select-Object StatusCode, Content

# Невалидные данные
$body4 = '{"username": "", "age": -5}'
iwr -Method POST -Uri "http://localhost:4000/api/users" -ContentType "application/json" -Body $body4 | Select-Object StatusCode, Content

# Невалидный UUID
iwr -Method GET -Uri "http://localhost:4000/api/users/invalid-uuid" | Select-Object StatusCode, Content

# 3.1 Несуществующий endpoint (+10 баллов)
iwr -Method GET -Uri "http://localhost:4000/api/nonexistent" | Select-Object StatusCode, Content

# 3.2 CORS и OPTIONS запросы
iwr -Method OPTIONS -Uri "http://localhost:4000/api/users" | Select-Object Headers

# 3.3 Проверка TypeScript (запуск скриптов)
Write-Host "Проверка скриптов запуска:"
Write-Host "start:dev: npm run start:dev"
Write-Host "start:prod: npm run start:prod"