# FreshSure Backend API

Backend API untuk aplikasi FreshSure - Food Quality & Supply Chain Management System.

## Tech Stack

- **Runtime**: Node.js dengan TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL dengan Prisma ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Zod
- **Security**: Helmet, CORS, Rate Limiting

## Struktur Project

```
src/
├── config/           # Konfigurasi (database, environment)
├── middleware/       # Middleware (auth, error handling)
├── modules/          # Modul-modul bisnis logic
│   ├── auth/
│   ├── companies/
│   ├── commodities/
│   ├── batches/
│   ├── sensors/
│   ├── quality/
│   ├── recommendations/
│   ├── actions/
│   ├── logistics/
│   ├── retail/
│   ├── feedback/
│   ├── outcomes/
│   └── analytics/
├── routes/           # Route aggregator
├── types/            # Type definitions
├── utils/            # Utility functions
└── server.ts         # Entry point
```

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Database

Buat file `.env` berdasarkan `.env.example`:

```bash
cp .env.example .env
```

Edit `.env` dan isi `DATABASE_URL` dengan connection string PostgreSQL Anda.

### 3. Generate Prisma Client

```bash
npm run prisma:generate
```

### 4. Run Migrations

```bash
npm run prisma:migrate
```

### 5. (Optional) Seed Database

```bash
npm run prisma:seed
```

### 6. Start Development Server

```bash
npm run dev
```

Server akan berjalan di `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user baru
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get user profile (protected)

### Companies
- `GET /api/companies` - List semua companies
- `GET /api/companies/:id` - Get company by ID
- `POST /api/companies` - Create company (Admin only)
- `PATCH /api/companies/:id` - Update company (Admin only)
- `DELETE /api/companies/:id` - Delete company (Admin only)

### Commodities
- `GET /api/commodities` - List commodities
- `GET /api/commodities/:id` - Get commodity by ID
- `POST /api/commodities` - Create commodity
- `PATCH /api/commodities/:id` - Update commodity
- `DELETE /api/commodities/:id` - Delete commodity (Admin only)

### Batches
- `GET /api/batches` - List batches (dengan filter)
- `GET /api/batches/:id` - Get batch detail
- `GET /api/batches/summary` - Get batch summary
- `POST /api/batches` - Create batch
- `PATCH /api/batches/:id` - Update batch
- `DELETE /api/batches/:id` - Delete batch (Admin only)

### Sensors
- `GET /api/sensors` - List sensors
- `GET /api/sensors/:id` - Get sensor by ID
- `POST /api/sensors` - Create sensor
- `POST /api/sensors/readings` - Create sensor reading
- `GET /api/sensors/batches/:batchId/readings` - Get readings untuk batch

### Quality
- `POST /api/quality/scores` - Create quality score
- `GET /api/quality/batches/:batchId/scores/latest` - Get latest quality score
- `GET /api/quality/batches/:batchId/scores/history` - Get quality history
- `POST /api/quality/predictions` - Create shelf life prediction
- `GET /api/quality/batches/:batchId/predictions/latest` - Get latest prediction
- `GET /api/quality/performance` - Get quality performance metrics

### Recommendations
- `GET /api/recommendations` - List recommendations
- `GET /api/recommendations/:id` - Get recommendation detail
- `GET /api/recommendations/priority/:priority` - Get by priority
- `POST /api/recommendations` - Create recommendation
- `PATCH /api/recommendations/:id` - Update recommendation

### Actions
- `GET /api/actions` - List actions
- `GET /api/actions/:id` - Get action detail
- `GET /api/actions/stats` - Get action statistics
- `POST /api/actions` - Create action
- `PATCH /api/actions/:id` - Update action

### Logistics
- `GET /api/logistics/routes` - List routes
- `GET /api/logistics/routes/:id` - Get route detail
- `POST /api/logistics/routes` - Create route
- `POST /api/logistics/batch-routes` - Assign batch to route
- `PATCH /api/logistics/batch-routes/:id/status` - Update route status
- `GET /api/logistics/batches/:batchId/routes` - Get routes for batch
- `GET /api/logistics/active` - Get active routes

### Retail
- `POST /api/retail/stores` - Create store
- `POST /api/retail/inventory` - Create inventory
- `GET /api/retail/inventory` - List inventory
- `GET /api/retail/inventory/low-stock` - Get low stock items
- `POST /api/retail/pricing/recommendations` - Create pricing recommendation
- `GET /api/retail/pricing/recommendations` - List pricing recommendations

### Feedback
- `GET /api/feedback` - List feedbacks
- `GET /api/feedback/:id` - Get feedback detail
- `POST /api/feedback` - Create feedback

### Outcomes
- `GET /api/outcomes` - List outcomes
- `GET /api/outcomes/:id` - Get outcome detail
- `GET /api/outcomes/stats` - Get outcome statistics
- `POST /api/outcomes` - Create outcome

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard statistics
- `GET /api/analytics/weekly-metrics` - Get weekly metrics
- `POST /api/analytics/weekly-metrics` - Create weekly metric

## Authentication

Kebanyakan endpoint memerlukan authentication. Gunakan header:

```
Authorization: Bearer <token>
```

Token didapat dari endpoint `/api/auth/login` atau `/api/auth/register`.

## Database Schema

Database menggunakan PostgreSQL dengan Prisma ORM. Schema lengkap ada di `prisma/schema.prisma`.

### Core Entities:
- **Users** - User accounts dengan role-based access
- **Companies** - Company/organization data
- **Commodities** - Master data komoditas
- **Batches** - Unit utama untuk tracking

### Sensor & Quality:
- **Sensors** - Sensor registry
- **SensorReadings** - Time-series sensor data
- **QualityScores** - Quality assessment scores
- **ShelfLifePredictions** - AI predictions untuk shelf life

### Recommendations & Actions:
- **Recommendations** - AI-generated recommendations
- **Actions** - User actions terhadap recommendations

### Logistics:
- **Routes** - Route definitions
- **BatchRoutes** - Batch routing assignments

### Retail:
- **Stores** - Store locations
- **RetailInventory** - Inventory di retail stores
- **PricingRecommendations** - Dynamic pricing suggestions

### Feedback & Analytics:
- **Feedback** - User feedback
- **Outcomes** - Final outcomes untuk ML training
- **WeeklyMetrics** - Weekly performance metrics

## Development

### Run in Development Mode

```bash
npm run dev
```

### Build for Production

```bash
npm run build
npm start
```

### Database Migrations

```bash
# Create new migration
npm run prisma:migrate

# Open Prisma Studio
npm run prisma:studio
```

## Best Practices

1. **Modular Structure**: Setiap modul memiliki service, controller, dan routes terpisah
2. **Type Safety**: Menggunakan TypeScript untuk type safety
3. **Validation**: Menggunakan Zod untuk request validation
4. **Error Handling**: Centralized error handling dengan custom error classes
5. **Security**: Helmet, CORS, rate limiting, dan JWT authentication
6. **Database**: Prisma ORM untuk type-safe database access

## License

ISC

