import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function cleanArrayQuestions() {
  try {
    console.log('🧹 Deleting all array questions from database...');
    
    // Get all questions where 'arrays' is in the topics JSON array
    const arrayQuestions = await prisma.question.findMany({
      where: {
        topics: {
          array_contains: 'arrays'
        }
      },
      select: { id: true, title: true }
    });

    console.log(`Found ${arrayQuestions.length} array questions to delete`);
    
    // Delete them
    for (const q of arrayQuestions) {
      await prisma.question.delete({
        where: { id: q.id }
      });
      console.log(`  ✅ Deleted: ${q.title}`);
    }
    
    console.log(`\n✅ Successfully deleted ${arrayQuestions.length} array questions`);
    console.log('Now run: npm run seed:all-questions');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanArrayQuestions();
