# Setup Guide - FreshSure Backend

## Prerequisites

- Node.js 18+ dan npm
- PostgreSQL 14+
- Git

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Copy `.env.example` ke `.env`:

```bash
cp .env.example .env
```

Edit `.env` dan isi dengan konfigurasi Anda:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/freshsure?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"
PORT=3000
NODE_ENV=development
CORS_ORIGIN="http://localhost:3000"
```

### 3. Setup Database

Buat database PostgreSQL:

```sql
CREATE DATABASE freshsure;
```

Atau menggunakan psql:

```bash
createdb freshsure
```

### 4. Generate Prisma Client

```bash
npm run prisma:generate
```

### 5. Run Database Migrations

```bash
npm run prisma:migrate
```

Ini akan membuat semua tabel di database.

### 6. (Optional) Seed Database

Untuk mengisi database dengan data sample:

```bash
npm run prisma:seed
```

Ini akan membuat:
- 3 companies (Farm, Logistics, Retail)
- 4 users (farmer, logistics, retail, admin)
- Sample commodities, batches, sensors, dll.

**Test credentials:**
- Farmer: `farmer@example.com` / `password123`
- Logistics: `logistics@example.com` / `password123`
- Retail: `retail@example.com` / `password123`
- Admin: `admin@example.com` / `password123`

### 7. Start Development Server

```bash
npm run dev
```

Server akan berjalan di `http://localhost:3000`

## Testing API

### Health Check

```bash
curl http://localhost:3000/api/health
```

### Register User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "FARMER",
    "companyId": "<company-id>"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "farmer@example.com",
    "password": "password123"
  }'
```

Response akan berisi `token` yang bisa digunakan untuk authenticated requests.

### Get Profile (Authenticated)

```bash
curl http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer <your-token>"
```

## Database Management

### Prisma Studio

Untuk melihat dan mengedit data secara visual:

```bash
npm run prisma:studio
```

Akan membuka browser di `http://localhost:5555`

### Create New Migration

Setelah mengubah schema:

```bash
npm run prisma:migrate
```

### Reset Database (Development Only)

```bash
npx prisma migrate reset
```

**WARNING**: Ini akan menghapus semua data!

## Project Structure

```
FreshSure/
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Database seeder
├── src/
│   ├── config/          # Configuration files
│   ├── middleware/      # Express middleware
│   ├── modules/         # Business logic modules
│   ├── routes/          # Route aggregator
│   ├── types/           # TypeScript types
│   ├── utils/           # Utility functions
│   └── server.ts         # Entry point
├── .env                 # Environment variables (create this)
├── .env.example          # Environment template
├── package.json
└── tsconfig.json
```

## Common Issues

### Port Already in Use

Jika port 3000 sudah digunakan, ubah `PORT` di `.env`.

### Database Connection Error

Pastikan:
1. PostgreSQL berjalan
2. Database sudah dibuat
3. `DATABASE_URL` di `.env` benar
4. User PostgreSQL punya permission

### Prisma Client Not Generated

Jalankan:
```bash
npm run prisma:generate
```

## Next Steps

1. Setup frontend application
2. Configure production environment variables
3. Setup CI/CD pipeline
4. Add unit tests
5. Setup monitoring & logging

