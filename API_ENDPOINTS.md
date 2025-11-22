# LumixCode Backend API Endpoints

## Current Endpoints

### Health Check
- **Route:** `GET /api/health`
- **Purpose:** Monitoring, deployment verification
- **Response:** 
  ```json
  {
    "status": "ok",
    "timestamp": "2024-11-21T...",
    "uptime": 12345
  }
  ```
- **Status Codes:** 200

---

### API Info
- **Route:** `GET /api/info`
- **Purpose:** API documentation endpoint
- **Response:** 
  ```json
  {
    "name": "LumixCode API",
    "version": "1.0.0",
    "environment": "production",
    "endpoints": [...]
  }
  ```
- **Status Codes:** 200

---

### List Users
- **Route:** `GET /api/users`
- **Purpose:** Retrieve all users (demo endpoint)
- **Response:** 
  ```json
  [
    {
      "id": "1",
      "username": "demo_user",
      "name": "Demo User",
      "createdAt": "2024-11-21T..."
    }
  ]
  ```
- **Status Codes:** 200
- **Auth:** Not required (development)

---

### Get Current User
- **Route:** `GET /api/me`
- **Purpose:** Get authenticated user's profile
- **Headers:** 
  ```
  Authorization: Bearer <token>
  ```
- **Response (Development):** 
  ```json
  {
    "id": "1",
    "username": "demo_user",
    "email": "demo@example.com"
  }
  ```
- **Response (Production - Authenticated):** 
  ```json
  {
    "id": "1",
    "username": "authenticated_user",
    "email": "user@example.com"
  }
  ```
- **Status Codes:** 
  - 200 - Success
  - 401 - Unauthorized (missing/invalid token in production)

---

## Error Responses

### Not Found (404)
```json
{
  "message": "Route not found",
  "error": "NOT_FOUND"
}
```

### Unauthorized (401)
```json
{
  "message": "Invalid or expired token",
  "error": "UNAUTHORIZED"
}
```

### Validation Error (400)
```json
{
  "message": "Validation failed",
  "error": "VALIDATION_ERROR",
  "details": {...}
}
```

### Server Error (500)
```json
{
  "message": "Internal Server Error",
  "error": "INTERNAL_ERROR"
}
```

---

## Coming Soon

- `POST /api/users` - Create new user
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `POST /api/projects` - Create project
- `GET /api/projects` - List projects
- `GET /api/projects/:id` - Get project details
- `POST /api/assets` - Upload asset
- `GET /api/assets` - List assets

---

## Testing Endpoints

### Local Development
```bash
curl http://localhost:5000/api/health
curl http://localhost:5000/api/info
curl http://localhost:5000/api/users
curl http://localhost:5000/api/me
```

### Production
```bash
curl https://your-api.up.railway.app/api/health
curl https://your-api.up.railway.app/api/info
curl https://your-api.up.railway.app/api/users
curl https://your-api.up.railway.app/api/me
```

### With Authorization
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://your-api.up.railway.app/api/me
```
