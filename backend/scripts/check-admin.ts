import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function checkAdmin() {
  try {
    const admins = await prisma.user.findMany({
      where: {
        OR: [
          { role: 'admin' },
          { role: 'super_admin' },
          { role: 'superadmin' },
        ],
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        isVerified: true,
        createdAt: true,
      },
    });

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 Admin Users Found:', admins.length);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    if (admins.length === 0) {
      console.log('❌ No admin users found in database!');
      console.log('💡 Run: npm run create:admin');
    } else {
      admins.forEach((admin, index) => {
        console.log(`\n👤 Admin ${index + 1}:`);
        console.log('   Email:', admin.email);
        console.log('   Name:', `${admin.firstName} ${admin.lastName}`);
        console.log('   Role:', admin.role);
        console.log('   Active:', admin.isActive);
        console.log('   Verified:', admin.isVerified);
        console.log('   Created:', admin.createdAt.toISOString());
      });
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  } catch (error) {
    console.error('❌ Error checking admin users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdmin();
