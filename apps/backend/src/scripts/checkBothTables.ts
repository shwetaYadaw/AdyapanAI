import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function check() {
  try {
    console.log('🔍 Checking database tables...\n');

    // Check QUESTION table
    const questionCount = await prisma.question.count();
    console.log(`📊 QUESTION table: ${questionCount} records`);
    
    if (questionCount > 0) {
      const sampleQuestions = await prisma.question.findMany({
        take: 3,
        select: { slug: true, title: true, difficulty: true, topics: true }
      });
      console.log('   Sample questions:');
      sampleQuestions.forEach((q, i) => {
        console.log(`   ${i+1}. ${q.title} (${q.difficulty})`);
      });
    }

    // Check PROBLEM table
    const problemCount = await prisma.problem.count();
    console.log(`\n📊 PROBLEM table: ${problemCount} records`);
    
    if (problemCount > 0) {
      const sampleProblems = await prisma.problem.findMany({
        take: 3,
        select: { slug: true, title: true, difficulty: true, topics: true }
      });
      console.log('   Sample problems:');
      sampleProblems.forEach((p, i) => {
        console.log(`   ${i+1}. ${p.title} (${p.difficulty})`);
      });
    }

    console.log('\n✅ Analysis:');
    console.log(`   Questions table: ${questionCount === 0 ? '❌ Empty' : '✅ Populated'}`);
    console.log(`   Problems table:  ${problemCount === 0 ? '❌ Empty' : '✅ Populated'}`);
    console.log(`   Frontend sees:   ${problemCount > 0 ? '✅ Problems' : '❌ Nothing (seed needed)'}`);

  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

check();
