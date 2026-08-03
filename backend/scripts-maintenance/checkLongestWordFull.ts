import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function checkLongestWordFull() {
  try {
    const problem = await prisma.question.findUnique({
      where: { slug: 'longest-word-in-dictionary' }
    });

    if (problem) {
      console.log('Problem found:');
      console.log('Title:', problem.title);
      console.log('Slug:', problem.slug);
      console.log('Difficulty:', problem.difficulty);
      console.log('Topics:', problem.topics);
      console.log('Companies:', problem.companies);
      console.log('\nStatement length:', (problem.statement as string).length);
      console.log('\nFirst 200 chars of statement:');
      console.log((problem.statement as string).substring(0, 200));
      console.log('\n...\n');
      console.log('Last 200 chars of statement:');
      console.log((problem.statement as string).substring((problem.statement as string).length - 200));
      
      console.log('\n\nTemplates:', (problem.templates as any[]).map(t => t.language));
      console.log('Test cases count:', (problem.testCases as any[]).length);
      
      console.log('\n✅ Problem is fully stored in database');
    } else {
      console.log('❌ Problem not found');
    }

    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

checkLongestWordFull();
