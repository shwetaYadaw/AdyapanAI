import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function cleanupSeatingTests() {
  try {
    console.log('🧹 Cleaning up Seating Arrangement tests...\n');

    // Find all seating arrangement tests
    const allTests = await prisma.aptitudeTest.findMany({
      where: {
        title: { contains: 'Seating Arrangement' },
        category: 'reasoning',
        company: 'TCS'
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log(`Found ${allTests.length} Seating Arrangement tests`);
    console.log('');

    allTests.forEach((test, idx) => {
      const questions = test.questions as any;
      console.log(`Test ${idx + 1}:`);
      console.log(`  Title: ${test.title}`);
      console.log(`  ID: ${test.id}`);
      console.log(`  Questions: ${questions ? questions.length : 0}`);
      console.log(`  Marks: ${test.totalMarks}`);
      console.log(`  Duration: ${test.duration} min`);
      console.log(`  Created: ${test.createdAt}`);
      console.log('');
    });

    // Keep only the newest one (with 7 questions)
    if (allTests.length > 1) {
      const testToKeep = allTests[0]; // Most recent
      const testToDelete = allTests.slice(1); // Older ones

      console.log(`\n⚠️ Deleting ${testToDelete.length} old test(s)...\n`);

      for (const test of testToDelete) {
        const questions = test.questions as any;
        const questionCount = questions ? questions.length : 0;

        await prisma.aptitudeTest.delete({
          where: { id: test.id }
        });

        console.log(`✅ Deleted: ${test.title} (${questionCount} questions)`);
      }

      console.log(`\n✅ Keeping: ${testToKeep.title}`);
      const questions = testToKeep.questions as any;
      console.log(`   Questions: ${questions ? questions.length : 0}`);
      console.log(`   Marks: ${testToKeep.totalMarks}`);
      console.log(`   Duration: ${testToKeep.duration} min`);
    } else {
      console.log('✅ Only one test found, no cleanup needed');
    }

    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

cleanupSeatingTests();
