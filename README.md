# CRUD API

## Install

```bash
npm install

```

## Start

```bash
npm run start:dev

npm run start:prod

```

### 1.1 GET all users (+10 points)
```bash
iwr -Method GET -Uri "http://localhost:4000/api/users" | Select-Object StatusCode, Content
```

### 1.2 POST create user (+10 points)
```bash
$body1 = '{"username": "Test User", "age": 25, "hobbies": ["reading", "swimming"]}'
$response1 = iwr -Method POST -Uri "http://localhost:4000/api/users" -ContentType "application/json" -Body $body1
$response1 | Select-Object StatusCode, Content
```

### 1.3 Save ID created user
```bash
$user = $response1.Content | ConvertFrom-Json
$userId = $user.id
Write-Host "ID created user: $userId"
```

### 1.4 GET user with ID (+10 points)
```bash
iwr -Method GET -Uri "http://localhost:4000/api/users/$userId" | Select-Object StatusCode, Content
```

### 1.5 PUT update user(+10 points)
```bash
$body2 = '{"username": "Updated User", "age": 26, "hobbies": ["coding", "gaming"]}'
iwr -Method PUT -Uri "http://localhost:4000/api/users/$userId" -ContentType "application/json" -Body $body2 | Select-Object StatusCode, Content
```

### 1.6 DELETE user (+10 points)
```bash
iwr -Method DELETE -Uri "http://localhost:4000/api/users/$userId" | Select-Object StatusCode, Content
```

### 2.1 Check user technical requirements (+6 points)
```bash
$body3 = '{"username": "Structure Test", "age": 30, "hobbies": ["test1", "test2"]}'
$response2 = iwr -Method POST -Uri "http://localhost:4000/api/users" -ContentType "application/json" -Body $body3
$userStruct = $response2.Content | ConvertFrom-Json
Write-Host "Checking structure:"
Write-Host "ID: $($userStruct.id)"
Write-Host "Username: $($userStruct.username)" 
Write-Host "Age: $($userStruct.age)"
Write-Host "Hobbies: $($userStruct.hobbies -join ', ')"
```

### 2.2 Check port from.env (+6 points)
```bash
Write-Host "Server is working on port 4000 - OK"
```

### 2.3 Testing errors (+10 points)
```bash
Write-Host "Testing Error Handling:"
```

### invalid JSON
```bash
iwr -Method POST -Uri "http://localhost:4000/api/users" -ContentType "application/json" -Body 'invalid json' | Select-Object StatusCode, Content
``` 
### Invalid data
```bash
$body4 = '{"username": "", "age": -5}'
iwr -Method POST -Uri "http://localhost:4000/api/users" -ContentType "application/json" -Body $body4 | Select-Object StatusCode, Content
```

### Invalid UUID
```bash
iwr -Method GET -Uri "http://localhost:4000/api/users/invalid-uuid" | Select-Object StatusCode, Content
```

### 3.1 Invalid endpoint (+10 points)
```bash
iwr -Method GET -Uri "http://localhost:4000/api/nonexistent" | Select-Object StatusCode, Content
```

### 3.2 CORS и OPTIONS requests
```bash
iwr -Method OPTIONS -Uri "http://localhost:4000/api/users" | Select-Object Headers
```

### 3.3 Check TypeScript (start scripts)
```bash
Write-Host "Check scripts running"
Write-Host "start:dev: npm run start:dev"
Write-Host "start:prod: npm run start:prod"
```