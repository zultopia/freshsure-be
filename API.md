# FreshSure API Documentation

Base URL: `http://localhost:3000/api`

## Authentication

Kebanyakan endpoint memerlukan JWT token di header:

```
Authorization: Bearer <token>
```

## Endpoints Overview

### Authentication (`/api/auth`)

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "FARMER",
  "companyId": "uuid"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "FARMER",
    "company": { ... }
  },
  "token": "jwt-token"
}
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

### Companies (`/api/companies`)

#### List Companies
```http
GET /api/companies?page=1&limit=10
Authorization: Bearer <token>
```

#### Get Company
```http
GET /api/companies/:id
Authorization: Bearer <token>
```

#### Create Company (Admin only)
```http
POST /api/companies
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Green Farm",
  "companyType": "FARM",
  "country": "Indonesia"
}
```

### Batches (`/api/batches`)

#### List Batches
```http
GET /api/batches?page=1&limit=10&companyId=uuid&status=ACTIVE
Authorization: Bearer <token>
```

#### Get Batch Detail
```http
GET /api/batches/:id
Authorization: Bearer <token>
```

#### Create Batch
```http
POST /api/batches
Authorization: Bearer <token>
Content-Type: application/json

{
  "commodityId": "uuid",
  "ownerCompanyId": "uuid",
  "harvestDate": "2024-01-15",
  "quantity": 100,
  "unit": "kg",
  "currentLocation": "Farm Warehouse"
}
```

#### Get Batch Summary
```http
GET /api/batches/summary?companyId=uuid
Authorization: Bearer <token>
```

### Quality (`/api/quality`)

#### Create Quality Score
```http
POST /api/quality/scores
Authorization: Bearer <token>
Content-Type: application/json

{
  "batchId": "uuid",
  "qualityScore": 85,
  "confidence": 0.92
}
```

#### Get Latest Quality Score
```http
GET /api/quality/batches/:batchId/scores/latest
Authorization: Bearer <token>
```

#### Get Quality Performance
```http
GET /api/quality/performance?companyId=uuid&days=7
Authorization: Bearer <token>
```

### Recommendations (`/api/recommendations`)

#### List Recommendations
```http
GET /api/recommendations?page=1&limit=10&priority=CRITICAL
Authorization: Bearer <token>
```

#### Create Recommendation
```http
POST /api/recommendations
Authorization: Bearer <token>
Content-Type: application/json

{
  "batchId": "uuid",
  "recommendationType": "SELL_FAST",
  "explanation": "Quality is good, recommend selling soon",
  "priority": "WARNING"
}
```

### Actions (`/api/actions`)

#### Create Action
```http
POST /api/actions
Authorization: Bearer <token>
Content-Type: application/json

{
  "recommendationId": "uuid",
  "userId": "uuid",
  "actionTaken": "ACCEPTED",
  "notes": "Will sell within 2 days"
}
```

#### Get Action Stats
```http
GET /api/actions/stats?companyId=uuid&days=30
Authorization: Bearer <token>
```

### Sensors (`/api/sensors`)

#### Create Sensor Reading
```http
POST /api/sensors/readings
Authorization: Bearer <token>
Content-Type: application/json

{
  "batchId": "uuid",
  "sensorId": "uuid",
  "temperature": 4.5,
  "humidity": 85.2
}
```

#### Get Batch Readings
```http
GET /api/sensors/batches/:batchId/readings?page=1&limit=50
Authorization: Bearer <token>
```

### Analytics (`/api/analytics`)

#### Get Dashboard Stats
```http
GET /api/analytics/dashboard?companyId=uuid
Authorization: Bearer <token>
```

#### Get Weekly Metrics
```http
GET /api/analytics/weekly-metrics?companyId=uuid&weeks=12
Authorization: Bearer <token>
```

### Feedback (`/api/feedback`)

#### Create Feedback
```http
POST /api/feedback
Authorization: Bearer <token>
Content-Type: application/json

{
  "batchId": "uuid",
  "feedbackType": "inventory_stock",
  "message": "Stock count is incorrect"
}
```

## Response Format

### Success Response
```json
{
  "data": { ... },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### Error Response
```json
{
  "error": "Error message",
  "details": [ ... ]
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `204` - No Content
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

## Pagination

Semua list endpoints mendukung pagination:

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)

## Filtering

Banyak endpoints mendukung filtering via query parameters:

- `companyId` - Filter by company
- `status` - Filter by status
- `startDate` / `endDate` - Date range filtering

## Rate Limiting

API memiliki rate limiting: 100 requests per 15 menit per IP.

