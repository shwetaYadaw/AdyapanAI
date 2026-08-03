import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function checkQuestions() {
  try {
    // Get all questions with 'arrays' topic
    const questionsWithArrays = await prisma.question.findMany({
      where: {
        topics: {
          array_contains: ['arrays']
        }
      },
      select: {
        id: true,
        title: true,
        difficulty: true,
        topics: true
      },
      orderBy: {
        title: 'asc'
      }
    });

    console.log(`\n📊 Total questions with 'arrays' topic: ${questionsWithArrays.length}\n`);
    
    questionsWithArrays.forEach((q, idx) => {
      console.log(`${idx + 1}. ${q.title} (${q.difficulty})`);
    });

    console.log(`\n✅ Done!`);
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

checkQuestions();
