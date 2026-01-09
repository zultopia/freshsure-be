import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create companies
  const farmCompany = await prisma.company.create({
    data: {
      name: 'Green Farm Co.',
      companyType: 'FARM',
      country: 'Indonesia',
    },
  });

  const logisticsCompany = await prisma.company.create({
    data: {
      name: 'Fast Logistics',
      companyType: 'LOGISTICS',
      country: 'Indonesia',
    },
  });

  const retailCompany = await prisma.company.create({
    data: {
      name: 'Fresh Market',
      companyType: 'RETAIL',
      country: 'Indonesia',
    },
  });

  console.log('✅ Companies created');

  // Create users
  const passwordHash = await bcrypt.hash('password123', 10);

  const farmer = await prisma.user.create({
    data: {
      name: 'John Farmer',
      email: 'farmer@example.com',
      passwordHash,
      role: 'FARMER',
      companyId: farmCompany.id,
    },
  });

  const logistics = await prisma.user.create({
    data: {
      name: 'Jane Logistics',
      email: 'logistics@example.com',
      passwordHash,
      role: 'LOGISTICS',
      companyId: logisticsCompany.id,
    },
  });

  const retailer = await prisma.user.create({
    data: {
      name: 'Bob Retailer',
      email: 'retail@example.com',
      passwordHash,
      role: 'RETAIL',
      companyId: retailCompany.id,
    },
  });

  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      passwordHash,
      role: 'ADMIN',
      companyId: farmCompany.id,
    },
  });

  console.log('✅ Users created');

  // Create commodities
  const tomato = await prisma.commodity.create({
    data: {
      name: 'Tomato',
      category: 'VEGETABLE',
      baseShelfLifeDays: 7,
    },
  });

  const apple = await prisma.commodity.create({
    data: {
      name: 'Apple',
      category: 'FRUIT',
      baseShelfLifeDays: 30,
    },
  });

  const beef = await prisma.commodity.create({
    data: {
      name: 'Beef',
      category: 'MEAT',
      baseShelfLifeDays: 3,
    },
  });

  console.log('✅ Commodities created');

  // Create batches
  const batch1 = await prisma.batch.create({
    data: {
      commodityId: tomato.id,
      ownerCompanyId: farmCompany.id,
      harvestDate: new Date(),
      quantity: 100,
      unit: 'kg',
      currentLocation: 'Farm Warehouse',
      status: 'ACTIVE',
    },
  });

  const batch2 = await prisma.batch.create({
    data: {
      commodityId: apple.id,
      ownerCompanyId: farmCompany.id,
      harvestDate: new Date(),
      quantity: 200,
      unit: 'kg',
      currentLocation: 'Farm Warehouse',
      status: 'ACTIVE',
    },
  });

  console.log('✅ Batches created');

  // Create sensors
  const tempSensor = await prisma.sensor.create({
    data: {
      sensorType: 'TEMPERATURE',
      model: 'TempPro-2024',
      installedAt: 'Farm Warehouse',
      isActive: true,
    },
  });

  const humiditySensor = await prisma.sensor.create({
    data: {
      sensorType: 'HUMIDITY',
      model: 'HumidPro-2024',
      installedAt: 'Farm Warehouse',
      isActive: true,
    },
  });

  console.log('✅ Sensors created');

  // Create sensor readings
  await prisma.sensorReading.createMany({
    data: [
      {
        batchId: batch1.id,
        sensorId: tempSensor.id,
        temperature: 4.5,
        timestamp: new Date(),
      },
      {
        batchId: batch1.id,
        sensorId: humiditySensor.id,
        humidity: 85.2,
        timestamp: new Date(),
      },
      {
        batchId: batch2.id,
        sensorId: tempSensor.id,
        temperature: 3.8,
        timestamp: new Date(),
      },
    ],
  });

  console.log('✅ Sensor readings created');

  // Create quality scores
  await prisma.qualityScore.create({
    data: {
      batchId: batch1.id,
      qualityScore: 85,
      confidence: 0.92,
    },
  });

  await prisma.qualityScore.create({
    data: {
      batchId: batch2.id,
      qualityScore: 92,
      confidence: 0.95,
    },
  });

  console.log('✅ Quality scores created');

  // Create shelf life predictions
  await prisma.shelfLifePrediction.create({
    data: {
      batchId: batch1.id,
      remainingHours: 120,
      minEstimate: 96,
      maxEstimate: 144,
      riskLevel: 'LOW',
    },
  });

  await prisma.shelfLifePrediction.create({
    data: {
      batchId: batch2.id,
      remainingHours: 600,
      minEstimate: 500,
      maxEstimate: 700,
      riskLevel: 'LOW',
    },
  });

  console.log('✅ Shelf life predictions created');

  // Create recommendations
  const recommendation1 = await prisma.recommendation.create({
    data: {
      batchId: batch1.id,
      recommendationType: 'SELL_FAST',
      explanation: 'Quality score is good, recommend selling within 5 days',
      priority: 'INFO',
    },
  });

  const recommendation2 = await prisma.recommendation.create({
    data: {
      batchId: batch2.id,
      recommendationType: 'STORE',
      explanation: 'Excellent quality, can be stored longer',
      priority: 'INFO',
    },
  });

  console.log('✅ Recommendations created');

  // Create actions
  await prisma.action.create({
    data: {
      recommendationId: recommendation1.id,
      userId: farmer.id,
      actionTaken: 'ACCEPTED',
      executedAt: new Date(),
    },
  });

  console.log('✅ Actions created');

  console.log('🎉 Seeding completed!');
  console.log('\n📝 Test credentials:');
  console.log('Farmer: farmer@example.com / password123');
  console.log('Logistics: logistics@example.com / password123');
  console.log('Retail: retail@example.com / password123');
  console.log('Admin: admin@example.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

