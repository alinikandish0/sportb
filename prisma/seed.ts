import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  // مثال:
  // await prisma.user.upsert({
  //   where: { email: 'admin@platform.com' },
  //   update: {},
  //   create: {
  //     email: 'admin@platform.com',
  //     passwordHash: 'CHANGE_ME_HASHED',
  //     firstName: 'Admin',
  //   },
  // });

  console.log('✅ Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
