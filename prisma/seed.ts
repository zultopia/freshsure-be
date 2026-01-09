import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');
  console.log('🗑️  Cleaning existing data...');

  // Delete all data in correct order (respecting foreign key constraints)
  await prisma.action.deleteMany();
  await prisma.recommendation.deleteMany();
  await prisma.outcome.deleteMany();
  await prisma.pricingRecommendation.deleteMany();
  await prisma.retailInventory.deleteMany();
  await prisma.store.deleteMany();
  await prisma.batchRoute.deleteMany();
  await prisma.route.deleteMany();
  await prisma.feedback.deleteMany();
  await prisma.shelfLifePrediction.deleteMany();
  await prisma.qualityScore.deleteMany();
  await prisma.sensorReading.deleteMany();
  await prisma.sensor.deleteMany();
  await prisma.batch.deleteMany();
  await prisma.commodity.deleteMany();
  await prisma.weeklyMetric.deleteMany();
  await prisma.user.deleteMany();
  await prisma.company.deleteMany();

  console.log('✅ Existing data cleaned');

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

  await prisma.user.create({
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

  await prisma.user.create({
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

  await prisma.commodity.create({
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

  await prisma.action.create({
    data: {
      recommendationId: recommendation2.id,
      userId: retailer.id,
      actionTaken: 'ACCEPTED',
      executedAt: new Date(),
    },
  });

  console.log('✅ Actions created');

  // Create routes
  const route1 = await prisma.route.create({
    data: {
      fromLocation: 'Farm Warehouse',
      toLocation: 'Distribution Center Jakarta',
      distanceKm: 150,
      estimatedTimeHr: 3.5,
      companyId: logisticsCompany.id,
    },
  });

  const route2 = await prisma.route.create({
    data: {
      fromLocation: 'Distribution Center Jakarta',
      toLocation: 'Fresh Market Store Bandung',
      distanceKm: 180,
      estimatedTimeHr: 4.0,
      companyId: logisticsCompany.id,
    },
  });

  const route3 = await prisma.route.create({
    data: {
      fromLocation: 'Farm Warehouse',
      toLocation: 'Fresh Market Store Surabaya',
      distanceKm: 800,
      estimatedTimeHr: 12.0,
      companyId: logisticsCompany.id,
    },
  });

  console.log('✅ Routes created');

  // Create batch routes
  await prisma.batchRoute.create({
    data: {
      batchId: batch1.id,
      routeId: route1.id,
      status: 'IN_TRANSIT',
      startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
  });

  await prisma.batchRoute.create({
    data: {
      batchId: batch2.id,
      routeId: route2.id,
      status: 'DELIVERED',
      startedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
      endedAt: new Date(Date.now() - 20 * 60 * 60 * 1000), // 20 hours ago
    },
  });

  await prisma.batchRoute.create({
    data: {
      batchId: batch1.id,
      routeId: route3.id,
      status: 'PLANNED',
    },
  });

  console.log('✅ Batch routes created');

  // Create stores
  const store1 = await prisma.store.create({
    data: {
      name: 'Fresh Market Bandung',
      location: 'Jl. Dago No. 123, Bandung',
      companyId: retailCompany.id,
    },
  });

  const store2 = await prisma.store.create({
    data: {
      name: 'Fresh Market Surabaya',
      location: 'Jl. Tunjungan No. 456, Surabaya',
      companyId: retailCompany.id,
    },
  });

  const store3 = await prisma.store.create({
    data: {
      name: 'Fresh Market Jakarta',
      location: 'Jl. Sudirman No. 789, Jakarta',
      companyId: retailCompany.id,
    },
  });

  console.log('✅ Stores created');

  // Create retail inventories
  const inventory1 = await prisma.retailInventory.create({
    data: {
      batchId: batch1.id,
      storeId: store1.id,
      stockQty: 50,
    },
  });

  const inventory2 = await prisma.retailInventory.create({
    data: {
      batchId: batch2.id,
      storeId: store2.id,
      stockQty: 100,
    },
  });

  const inventory3 = await prisma.retailInventory.create({
    data: {
      batchId: batch1.id,
      storeId: store3.id,
      stockQty: 30,
    },
  });

  console.log('✅ Retail inventories created');

  // Create pricing recommendations
  await prisma.pricingRecommendation.create({
    data: {
      inventoryId: inventory1.id,
      originalPrice: 25000,
      recommendedPrice: 22000,
      discountPct: 12,
      reason: 'Shelf life prediction indicates need for faster sales',
    },
  });

  await prisma.pricingRecommendation.create({
    data: {
      inventoryId: inventory2.id,
      originalPrice: 35000,
      recommendedPrice: 35000,
      discountPct: 0,
      reason: 'Excellent quality, maintain current pricing',
    },
  });

  await prisma.pricingRecommendation.create({
    data: {
      inventoryId: inventory3.id,
      originalPrice: 25000,
      recommendedPrice: 20000,
      discountPct: 20,
      reason: 'High risk of spoilage, recommend discount to clear inventory',
    },
  });

  console.log('✅ Pricing recommendations created');

  // Create feedbacks
  await prisma.feedback.create({
    data: {
      userId: farmer.id,
      batchId: batch1.id,
      feedbackType: 'spoilage_misread',
      message: 'Quality score seems lower than actual condition. Batch looks fresh.',
    },
  });

  await prisma.feedback.create({
    data: {
      userId: retailer.id,
      batchId: batch2.id,
      feedbackType: 'pricing',
      message: 'Pricing recommendation was accurate. Sales increased after discount.',
    },
  });

  await prisma.feedback.create({
    data: {
      userId: farmer.id,
      feedbackType: 'inventory_stock',
      message: 'Need more accurate stock tracking at warehouse level.',
    },
  });

  await prisma.feedback.create({
    data: {
      userId: retailer.id,
      batchId: batch1.id,
      feedbackType: 'rerouting',
      message: 'Route optimization worked well. Delivery was faster than expected.',
    },
  });

  console.log('✅ Feedbacks created');

  // Create outcomes
  await prisma.outcome.create({
    data: {
      batchId: batch1.id,
      soldQty: 45,
      wastedQty: 5,
      avgSellPrice: 22000,
      spoilageReason: 'Temperature fluctuation during transport',
    },
  });

  await prisma.outcome.create({
    data: {
      batchId: batch2.id,
      soldQty: 95,
      wastedQty: 5,
      avgSellPrice: 35000,
      spoilageReason: 'Normal spoilage rate',
    },
  });

  await prisma.outcome.create({
    data: {
      batchId: batch1.id,
      soldQty: 25,
      wastedQty: 5,
      avgSellPrice: 20000,
      spoilageReason: 'Extended storage period',
    },
  });

  console.log('✅ Outcomes created');

  // Create weekly metrics
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  lastWeek.setHours(0, 0, 0, 0);

  const twoWeeksAgo = new Date(lastWeek);
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 7);

  await prisma.weeklyMetric.create({
    data: {
      companyId: farmCompany.id,
      weekStart: twoWeeksAgo,
      wasteReductionPct: 15.5,
      revenueUpliftPct: 8.2,
      avgShelfLifeGainHr: 24,
    },
  });

  await prisma.weeklyMetric.create({
    data: {
      companyId: farmCompany.id,
      weekStart: lastWeek,
      wasteReductionPct: 18.3,
      revenueUpliftPct: 12.5,
      avgShelfLifeGainHr: 32,
    },
  });

  await prisma.weeklyMetric.create({
    data: {
      companyId: logisticsCompany.id,
      weekStart: lastWeek,
      wasteReductionPct: 10.2,
      revenueUpliftPct: 5.8,
      avgShelfLifeGainHr: 18,
    },
  });

  await prisma.weeklyMetric.create({
    data: {
      companyId: retailCompany.id,
      weekStart: lastWeek,
      wasteReductionPct: 22.1,
      revenueUpliftPct: 15.3,
      avgShelfLifeGainHr: 28,
    },
  });

  console.log('✅ Weekly metrics created');

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

