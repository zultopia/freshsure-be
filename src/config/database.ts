import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

prisma.$connect()
  .then(() => {
    console.log('✅ Database connected successfully');
  })
  .catch((error: Prisma.PrismaClientInitializationError) => {
    console.error('⚠️  Database connection warning:');
    if (error.errorCode === 'P1001') {
      console.error('   Cannot reach database server.');
      console.error('   Please make sure:');
      console.error('   1. PostgreSQL is running');
      console.error('   2. DATABASE_URL in .env is correct');
      console.error('   3. Database server is accessible at the specified host/port');
      console.error(`   Current DATABASE_URL: ${process.env.DATABASE_URL ? 'Set' : 'NOT SET'}`);
    } else {
      console.error('   Error:', error.message);
    }
    console.error('\n💡 To fix this:');
    console.error('   - Start PostgreSQL: brew services start postgresql@14 (macOS)');
    console.error('   - Or check your DATABASE_URL in .env file');
    console.error('   - Server will start but database operations will fail until connection is established\n');
  });

// Handle graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;

