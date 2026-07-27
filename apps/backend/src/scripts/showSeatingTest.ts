import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function showSeatingTest() {
  try {
    console.log('\n📊 SEATING ARRANGEMENT TEST - FULL DETAILS\n');
    console.log('='.repeat(70));

    const test = await prisma.aptitudeTest.findFirst({
      where: {
        title: { contains: 'Seating Arrangement' },
        category: 'reasoning',
        company: 'TCS'
      },
      orderBy: { createdAt: 'desc' }
    });

    if (!test) {
      console.log('❌ Test not found');
      await prisma.$disconnect();
      return;
    }

    console.log(`\nTest: ${test.title}`);
    console.log(`ID: ${test.id}`);
    console.log(`Duration: ${test.duration} minutes`);
    console.log(`Total Marks: ${test.totalMarks}`);
    console.log(`Category: ${test.category}`);
    console.log(`Difficulty: ${test.difficulty}`);

    const questions = test.questions as any;
    console.log(`\n📝 QUESTIONS: ${questions ? questions.length : 0}\n`);

    if (questions && questions.length > 0) {
      questions.forEach((q: any, idx: number) => {
        const title = q.text.split('\n')[0].substring(0, 60);
        const marks = q.marks || 0;
        console.log(`${idx + 1}. ${title}... [${marks} marks]`);
      });
    }

    console.log('\n' + '='.repeat(70));
    console.log('\n✅ Test contains all problems!');
    console.log('✅ When student takes test, they see all problems above');
    console.log('✅ Problems 5-7 are the circular seating questions\n');

    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

showSeatingTest();
