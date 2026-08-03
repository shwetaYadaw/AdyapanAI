import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function verify() {
  try {
    console.log('\n✨ FINAL VERIFICATION - TCS SEATING ARRANGEMENT TEST\n');
    console.log('=' .repeat(60));

    const tests = await prisma.aptitudeTest.findMany({
      where: {
        title: { contains: 'Seating' },
        category: 'reasoning',
        company: 'TCS'
      }
    });

    console.log(`\n📊 Total Seating Tests: ${tests.length}\n`);

    tests.forEach((test, idx) => {
      const questions = test.questions as any;
      console.log(`Test ${idx + 1}:`);
      console.log(`  ID: ${test.id}`);
      console.log(`  Title: ${test.title}`);
      console.log(`  Duration: ${test.duration} min`);
      console.log(`  Total Marks: ${test.totalMarks}`);
      console.log(`  Questions: ${questions?.length || 0}`);

      if (questions && Array.isArray(questions)) {
        console.log(`\n  📝 Question List:`);
        questions.forEach((q: any, qIdx: number) => {
          const title = q.text?.split('\n')[0] || 'N/A';
          const marks = q.marks || 'N/A';
          const options = q.options?.length || 0;
          console.log(`    ${qIdx + 1}. ${title.substring(0, 55)}... [${marks} marks, ${options} options]`);
        });
      }
      console.log('\n' + '-'.repeat(60) + '\n');
    });

    console.log('\n✅ Database verification complete!\n');
    console.log('📌 Next Steps:');
    console.log('1. Start the web app (npm run dev in apps/web)');
    console.log('2. Go to http://localhost:3000/student/placement');
    console.log('3. Click "Aptitude Tests" tab');
    console.log('4. Click "Start Test" on TCS Reasoning: Seating Arrangement');
    console.log('5. You should see all 7 questions displayed properly\n');

    await prisma.$disconnect();
  } catch (error) {
    console.error('Error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

verify();
