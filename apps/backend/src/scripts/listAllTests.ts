import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function listAll() {
  try {
    const tests = await prisma.aptitudeTest.findMany({
      where: {
        company: 'TCS',
        category: 'reasoning'
      },
      select: {
        id: true,
        title: true,
        duration: true,
        totalMarks: true,
        isActive: true,
        questions: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log('\n📚 ALL TCS REASONING TESTS IN DATABASE\n');
    console.log('='.repeat(80));

    tests.forEach((t, idx) => {
      const questions = t.questions as any;
      console.log(`\n${idx + 1}. ${t.title}`);
      console.log(`   ID: ${t.id}`);
      console.log(`   Status: ${t.isActive ? '✅ Active' : '❌ Inactive'}`);
      console.log(`   Duration: ${t.duration} min | Marks: ${t.totalMarks}`);
      console.log(`   Questions: ${questions?.length || 0}`);
    });

    console.log('\n' + '='.repeat(80));
    console.log(`\nTotal Tests: ${tests.length}\n`);

    console.log('🔗 Access Tests:\n');
    tests.forEach((t) => {
      console.log(`   ${t.title}`);
      console.log(`   → /api/placement/aptitude/tests/${t.id}\n`);
    });

    await prisma.$disconnect();
  } catch (error) {
    console.error('Error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

listAll();
