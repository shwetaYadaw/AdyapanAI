import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function verify() {
  try {
    const tests = await prisma.aptitudeTest.findMany({
      where: {
        title: { contains: 'Seating' },
        category: 'reasoning',
        company: 'TCS'
      },
      select: {
        id: true,
        title: true,
        questions: true,
        duration: true,
        totalMarks: true
      }
    });

    console.log(`\n📋 Found ${tests.length} Seating tests:\n`);

    tests.forEach((test, idx) => {
      const questions = test.questions as any;
      console.log(`Test ${idx + 1}:`);
      console.log(`  ID: ${test.id}`);
      console.log(`  Title: ${test.title}`);
      console.log(`  Questions: ${questions?.length || 0}`);
      console.log(`  Duration: ${test.duration} min`);
      console.log(`  Marks: ${test.totalMarks}`);
      
      if (questions && Array.isArray(questions)) {
        console.log(`  Question titles:`);
        questions.forEach((q: any, qIdx: number) => {
          const firstLine = q.text?.split('\n')[0]?.substring(0, 60) || 'N/A';
          console.log(`    Q${qIdx + 1}: ${firstLine}...`);
        });
      }
      console.log();
    });

    await prisma.$disconnect();
  } catch (error) {
    console.error('Error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

verify();
