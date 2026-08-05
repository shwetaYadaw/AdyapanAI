/**
 * Seed test data for analytics dashboard
 * Creates test students, problems, and submissions
 */

require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const pg = require('pg');
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function seedTestData() {
  try {
    console.log('🌱 Starting test data seed...');

    // 1. Create test admin user if doesn't exist
    let admin = await prisma.user.findFirst({ where: { role: 'admin' } });
    if (!admin) {
      admin = await prisma.user.create({
        data: {
          firstName: 'Admin',
          lastName: 'User',
          email: 'admin@test.com',
          password: '$2a$10$4Ks5l7vSHB6Pp.QKLFPzSugHKbYJCE.H7eFqQXYAk7E.O8jQXJvV2', // hashed "admin123"
          role: 'admin',
          isActive: true,
          isEmailVerified: true,
        },
      });
      console.log('✅ Created admin user');
    }

    // 2. Create test students
    const studentEmails = [
      'student1@test.com',
      'student2@test.com',
      'student3@test.com',
      'student4@test.com',
      'student5@test.com',
    ];

    const students = [];
    for (const email of studentEmails) {
      let student = await prisma.user.findUnique({ where: { email } });
      if (!student) {
        student = await prisma.user.create({
          data: {
            firstName: `Student`,
            lastName: `${students.length + 1}`,
            email,
            password: '$2a$10$4Ks5l7vSHB6Pp.QKLFPzSugHKbYJCE.H7eFqQXYAk7E.O8jQXJvV2', // "password123"
            role: 'student',
            isActive: true,
            lastLogin: new Date(),
            isEmailVerified: true,
          },
        });

        // Create student profile
        await prisma.studentProfile.create({
          data: {
            userId: student.id,
            xp: Math.floor(Math.random() * 5000),
            level: Math.floor(Math.random() * 50) + 1,
            streak: Math.floor(Math.random() * 30),
          },
        });
      }
      students.push(student);
    }
    console.log(`✅ Created/Found ${students.length} test students`);

    // 3. Get existing problems
    const problems = await prisma.problem.findMany({ take: 10 });
    
    if (problems.length === 0) {
      console.log('⚠️  No problems found in database. Please seed problems first.');
    } else {
      console.log(`📊 Found ${problems.length} existing problems`);
    }

    // 4. Create test submissions
    const submissionCount = await prisma.problemSubmission.count();

    if (submissionCount === 0 && problems.length > 0) {
      const statuses = ['accepted', 'rejected', 'failed', 'accepted', 'runtime_error'];
      let submissionCreated = 0;

      for (const student of students) {
        for (let i = 0; i < Math.min(problems.length, 3); i++) {
          const status = statuses[Math.floor(Math.random() * statuses.length)];
          const daysAgo = Math.floor(Math.random() * 30);
          const submittedAt = new Date();
          submittedAt.setDate(submittedAt.getDate() - daysAgo);

          await prisma.problemSubmission.create({
            data: {
              userId: student.id,
              problemId: problems[i].id,
              language: ['javascript', 'python', 'java', 'cpp'][Math.floor(Math.random() * 4)],
              code: '// Submitted code',
              status,
              runtime: status === 'accepted' ? Math.floor(Math.random() * 100) + 10 : 0,
              passedCount: status === 'accepted' ? Math.floor(Math.random() * 10) + 5 : Math.floor(Math.random() * 3),
              totalCount: 15,
              createdAt: submittedAt,
            },
          });
          submissionCreated++;
        }
      }
      console.log(`✅ Created ${submissionCreated} test submissions`);
    } else if (submissionCount > 0) {
      console.log(`📊 Database already has ${submissionCount} submissions`);
    }

    console.log('🎉 Test data seed completed successfully!');
    if (students.length > 0 && problems.length > 0) {
      console.log('📊 Analytics should now show:');
      console.log(`   - Students: ${students.length}`);
      console.log(`   - Problems: ${problems.length}`);
      console.log(`   - Submissions: Multiple submissions`);
    }
  } catch (error) {
    console.error('❌ Error seeding data:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedTestData();
