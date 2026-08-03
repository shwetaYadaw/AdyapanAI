import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function deleteOldPlaceholders() {
  try {
    console.log('🧹 Finding and deleting old placeholder questions...\n');
    
    const allArrayQuestions = await prisma.question.findMany({
      where: {
        topics: {
          array_contains: 'arrays'
        }
      },
      select: { id: true, title: true, statement: true }
    });

    console.log(`Found ${allArrayQuestions.length} array questions total\n`);

    // Find all questions with placeholder statements
    const placeholders = allArrayQuestions.filter(q => 
      q.statement.includes('Practice solving')
    );

    console.log(`Found ${placeholders.length} old placeholder questions to delete:\n`);

    for (const placeholder of placeholders) {
      await prisma.question.delete({
        where: { id: placeholder.id }
      });
      console.log(`  ✅ Deleted: "${placeholder.title}"`);
    }

    // Verify final count
    const remaining = await prisma.question.findMany({
      where: {
        topics: {
          array_contains: 'arrays'
        }
      },
      select: { id: true, title: true }
    });

    console.log(`\n✅ Done! Remaining array questions: ${remaining.length}`);
    console.log('\nRemaining questions:');
    remaining.forEach((q, i) => {
      console.log(`  ${i + 1}. ${q.title}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteOldPlaceholders();
