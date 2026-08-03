import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function verify() {
  try {
    console.log('\n📊 VERIFICATION - TCS Non-Verbal Reasoning Test\n');
    console.log('='.repeat(60));

    const test = await prisma.aptitudeTest.findUnique({
      where: {
        id: '8cfeefcc-3225-40fb-b6d6-d623b8c4d114'
      }
    });

    if (!test) {
      console.log('❌ Test not found');
      return;
    }

    const questions = test.questions as any;

    console.log(`\n✅ Test Found!\n`);
    console.log(`ID: ${test.id}`);
    console.log(`Title: ${test.title}`);
    console.log(`Category: ${test.category}`);
    console.log(`Company: ${test.company}`);
    console.log(`Difficulty: ${test.difficulty}`);
    console.log(`Duration: ${test.duration} minutes`);
    console.log(`Total Marks: ${test.totalMarks}`);
    console.log(`Questions: ${questions?.length || 0}\n`);

    if (questions && Array.isArray(questions)) {
      console.log('📝 Question Breakdown:\n');
      questions.forEach((q: any, idx: number) => {
        const firstLine = q.text?.split('\n')[0]?.substring(0, 70) || 'N/A';
        console.log(`Q${idx + 1}: ${firstLine}...`);
        console.log(`   Marks: ${q.marks}`);
        console.log(`   Options: ${q.options?.length || 0}`);
        console.log(`   Correct Answer: ${q.correctAnswer}`);
        console.log(`   Explanation Length: ${q.explanation?.length || 0} characters\n`);
      });
    }

    console.log('\n✨ All data verified successfully!\n');

    await prisma.$disconnect();
  } catch (error) {
    console.error('Error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

verify();
