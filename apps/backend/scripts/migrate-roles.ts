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

async function migrateRoles() {
  try {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔄 Role Migration: Simplifying to Student & Admin');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Get current role distribution
    const currentRoles = await prisma.$queryRaw<{ role: string; count: bigint }[]>`
      SELECT role, COUNT(*)::int as count
      FROM "User"
      GROUP BY role
      ORDER BY count DESC
    `;

    console.log('📊 Current Role Distribution:');
    let totalUsers = 0;
    currentRoles.forEach((r) => {
      const count = Number(r.count);
      totalUsers += count;
      console.log(`   ${r.role.padEnd(15)} : ${count}`);
    });
    console.log(`   ${'TOTAL'.padEnd(15)} : ${totalUsers}\n`);

    // Confirm migration
    console.log('🔄 Migration Plan:');
    console.log('   • superadmin    → admin');
    console.log('   • teacher       → student');
    console.log('   • mentor        → student');
    console.log('   • recruiter     → student');
    console.log('   • student       → student (no change)');
    console.log('   • admin         → admin (no change)\n');

    // Update superadmin to admin
    const superAdminResult = await prisma.user.updateMany({
      where: { role: 'superadmin' },
      data: { role: 'admin' },
    });

    if (superAdminResult.count > 0) {
      console.log(`✅ Converted ${superAdminResult.count} superadmin(s) to admin`);
    }

    // Update teacher to student
    const teacherResult = await prisma.user.updateMany({
      where: { role: 'teacher' },
      data: { role: 'student' },
    });

    if (teacherResult.count > 0) {
      console.log(`✅ Converted ${teacherResult.count} teacher(s) to student`);
    }

    // Update mentor to student
    const mentorResult = await prisma.user.updateMany({
      where: { role: 'mentor' },
      data: { role: 'student' },
    });

    if (mentorResult.count > 0) {
      console.log(`✅ Converted ${mentorResult.count} mentor(s) to student`);
    }

    // Update recruiter to student
    const recruiterResult = await prisma.user.updateMany({
      where: { role: 'recruiter' },
      data: { role: 'student' },
    });

    if (recruiterResult.count > 0) {
      console.log(`✅ Converted ${recruiterResult.count} recruiter(s) to student`);
    }

    // Show final distribution
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    const finalRoles = await prisma.$queryRaw<{ role: string; count: bigint }[]>`
      SELECT role, COUNT(*)::int as count
      FROM "User"
      GROUP BY role
      ORDER BY count DESC
    `;

    console.log('📊 Final Role Distribution:');
    let finalTotal = 0;
    finalRoles.forEach((r) => {
      const count = Number(r.count);
      finalTotal += count;
      const emoji = r.role === 'admin' ? '👑' : '👤';
      console.log(`   ${emoji} ${r.role.padEnd(13)} : ${count}`);
    });
    console.log(`   ${'TOTAL'.padEnd(15)} : ${finalTotal}`);

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Migration completed successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Verify no old roles remain
    const oldRoles = await prisma.user.findMany({
      where: {
        role: {
          in: ['teacher', 'mentor', 'recruiter', 'superadmin'],
        },
      },
      select: { email: true, role: true },
    });

    if (oldRoles.length > 0) {
      console.log('⚠️  Warning: Some users still have old roles:');
      oldRoles.forEach((u) => {
        console.log(`   ${u.email}: ${u.role}`);
      });
    } else {
      console.log('✅ All users successfully migrated to student/admin roles');
    }

    console.log('\n📝 Summary:');
    console.log(`   • Total users processed: ${totalUsers}`);
    console.log(`   • Superadmins migrated: ${superAdminResult.count}`);
    console.log(`   • Teachers migrated: ${teacherResult.count}`);
    console.log(`   • Mentors migrated: ${mentorResult.count}`);
    console.log(`   • Recruiters migrated: ${recruiterResult.count}`);
    console.log(`   • Final student count: ${finalRoles.find(r => r.role === 'student')?.count || 0}`);
    console.log(`   • Final admin count: ${finalRoles.find(r => r.role === 'admin')?.count || 0}\n`);

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration
console.log('\n🚀 Starting role migration...\n');
migrateRoles();
