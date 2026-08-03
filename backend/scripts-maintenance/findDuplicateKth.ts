import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function findDuplicateKth() {
  try {
    console.log('🔍 Searching for duplicate "Kth" questions in arrays...\n');

    // Find all questions in arrays topic with Kth in title
    const questions = await prisma.question.findMany({
      where: {
        topics: { array_contains: 'arrays' },
        title: { contains: 'Kth' }
      },
      select: {
        id: true,
        slug: true,
        title: true,
        statement: true,
        createdAt: true
      },
      orderBy: { createdAt: 'asc' }
    });

    console.log(`Found ${questions.length} questions with 'Kth' in title:\n`);
    
    questions.forEach((q, idx) => {
      const isOld = q.statement && q.statement.includes('Practice solving');
      const marker = isOld ? '❌ OLD' : '✅ NEW';
      console.log(`${idx + 1}. ${marker} - "${q.title}"`);
      console.log(`   Slug: ${q.slug}`);
      console.log(`   Created: ${q.createdAt}`);
      console.log(`   Preview: ${q.statement?.substring(0, 60)}...\n`);
    });

    // Find and delete old ones
    const oldQuestions = questions.filter(q => q.statement && q.statement.includes('Practice solving'));
    
    if (oldQuestions.length > 0) {
      console.log(`\n⚠️  Found ${oldQuestions.length} old question(s) to delete:\n`);
      
      for (const oldQ of oldQuestions) {
        console.log(`Deleting: "${oldQ.title}" (${oldQ.slug})`);
        await prisma.question.delete({
          where: { id: oldQ.id }
        });
        console.log('✅ Deleted!\n');
      }
    } else {
      console.log('✅ No old "Kth" questions found - all are updated!\n');
    }

    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

findDuplicateKth();
