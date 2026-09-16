// Seed script - test ma'lumotlar qo'shish
import { db } from './src/db';
import { sublinks, users } from './src/db/schema';

async function seed() {
  console.log('🌱 Seeding database...');

  try {
    // Test sublink qo'shish (bu test uchun, real sublink bo'lishi kerak)
    const testSublink = await db.insert(sublinks).values({
      name: 'Test Sublink 1',
      url: 'https://example.com/subscription',
      format: 'base64',
      isActive: true,
      totalServers: 0,
      vlessCount: 0,
      vmessCount: 0,
      shadowsocksCount: 0,
      trojanCount: 0,
      hysteria2Count: 0,
      otherCount: 0,
      serversData: [],
      updatedAt: new Date(),
    }).returning();

    console.log('✅ Test sublink qo\'shildi:', testSublink[0].name);

    // Test user qo'shish
    const testUser = await db.insert(users).values({
      name: 'Test User 1',
      note: 'Bu test foydalanuvchi',
      sublinkConfigs: [
        { sublinkId: testSublink[0].id, serverLimit: 10 },
      ],
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 kun
      isActive: true,
      updatedAt: new Date(),
    }).returning();

    console.log('✅ Test user qo\'shildi:', testUser[0].name);

    console.log('🎉 Seeding yakunlandi!');
  } catch (error) {
    console.error('❌ Seed xatosi:', error);
    process.exit(1);
  }

  process.exit(0);
}

seed();
