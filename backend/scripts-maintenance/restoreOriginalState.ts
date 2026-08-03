import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function restoreOriginalState() {
  try {
    console.log('🔄 Restoring to original state (545 questions)...\n');

    // First, let's identify the 3 questions we added today
    const questionsToRemove = [
      'smallest-window-in-a-string-containing-all-characters-of-another-string',
      'count-palindromic-subsequences-strings',
      'count-palindromic-subsequences'
    ];

    console.log('🗑️  Removing the 3 questions added today:');
    
    for (const slug of questionsToRemove) {
      const question = await prisma.question.findUnique({
        where: { slug },
        select: { id: true, title: true }
      });
      
      if (question) {
        await prisma.question.delete({
          where: { slug }
        });
        console.log(`   ❌ Deleted: ${question.title}`);
      } else {
        console.log(`   ⚠️  Not found: ${slug}`);
      }
    }

    const currentCount = await prisma.question.count();
    console.log(`\n📊 Current count after removal: ${currentCount} questions`);

    console.log('\n💡 To restore the original 545 questions with duplicates:');
    console.log('   You need to re-run the seed script:');
    console.log('   cd apps/backend');
    console.log('   npm run seed:challenges');
    console.log('\n⚠️  Note: This will add back all 545 original questions (including the 46 duplicates)');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

restoreOriginalState();
