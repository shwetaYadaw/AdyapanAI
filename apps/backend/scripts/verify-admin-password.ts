import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcryptjs';
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

async function verifyAdminPassword() {
  try {
    const email = 'admin@adyapan.com';
    const testPassword = 'Admin@123';

    const admin = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        isEmailVerified: true,
        isVerified: true,
      },
    });

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔍 Admin Password Verification');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    if (!admin) {
      console.log('❌ Admin not found!');
      return;
    }

    console.log('\n📊 Admin Details:');
    console.log('   Email:', admin.email);
    console.log('   Name:', `${admin.firstName} ${admin.lastName}`);
    console.log('   Role:', admin.role);
    console.log('   Active:', admin.isActive);
    console.log('   Email Verified:', admin.isEmailVerified);
    console.log('   Verified:', admin.isVerified);
    console.log('   Has Password:', !!admin.password);
    console.log('   Password Hash Length:', admin.password?.length || 0);

    if (!admin.password) {
      console.log('\n❌ PROBLEM: Admin has no password set!');
      console.log('💡 Solution: Delete and recreate admin user');
      return;
    }

    // Test password comparison
    const isMatch = await bcrypt.compare(testPassword, admin.password);
    console.log('\n🔐 Password Test:');
    console.log('   Testing password:', testPassword);
    console.log('   Match result:', isMatch ? '✅ CORRECT' : '❌ WRONG');

    if (!isMatch) {
      console.log('\n⚠️  Password does not match!');
      console.log('💡 Try resetting the admin password');
    } else {
      console.log('\n✅ Password is correct!');
      console.log('💡 Login should work with these credentials');
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyAdminPassword();
